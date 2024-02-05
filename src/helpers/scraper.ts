import axios from "axios";
import cheerio from "cheerio";

import { AICS_BASE_URL } from "../constants/index";

async function scrapeWebSite(url: string): Promise<cheerio.Root> {
  const response = await axios.get(url);
  const html = response.data;
  return cheerio.load(html);
}

interface ITournamentLink {
  text: string;
  href: string;
  path: string;
}

async function scrapeHRefsTournaments(url: string, currentPath = ""): Promise<ITournamentLink[]> {
  console.log("url", url);
  console.log("currentPath", currentPath);
  const $ = await scrapeWebSite(url);
  const data: ITournamentLink[] = [];

  const elements = $(".sezione ul li a");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const text = $(element).text().trim();
    const href = $(element).attr("href");
    const newPath = `${currentPath}>${text}`;

    if (href && href.includes("homegirone")) {
      data.push({ text, href, path: newPath });
    } else {
      const elems = await scrapeHRefsTournaments(`${AICS_BASE_URL}/${href}`, newPath);
      data.push(...elems);
    }
  }

  return data;
}

interface ILink {
  href: string;
  text: string;
}

async function scrapeHRefsFrommAICSWebSite(url: string): Promise<ILink[]> {
  const $ = await scrapeWebSite(url);
  const container = $(".sezione");
  const firstH2 = container.find("h2").first();
  const links = firstH2.find("a");
  const linkData: ILink[] = links
    .map((_index, element) => {
      const href = $(element).attr("href");
      const text = $(element).text();
      return { href, text };
    })
    .get();
  return linkData;
}

async function scrapeHRefsTeamsFrommAICSWebSite(url: string): Promise<any[]> {
  const $ = await scrapeWebSite(url);
  const container = $(".sezione");
  const links = container.find("p");
  const linkData = links
    .map((index, element) => {
      const hrefElem = $(element).find("a");
      const href = $(hrefElem).attr("href");
      const text = $(hrefElem).text().trim();
      return { href, text };
    })
    .get();
  return linkData;
}

async function scrapeTableFromAICSWebSite(url: string, idx = 0): Promise<any[]> {
  const $ = await scrapeWebSite(url);
  const container = $(".sezione");
  const table = container.find("table").eq(idx);
  return htmlTableToJson($, table);
}

function htmlTableToJson($: cheerio.Root, table: cheerio.Cheerio): any[] {
  const tableData: any[] = [];

  const rows = table.find("tr");
  const keys: string[] = [];

  rows
    .first()
    .find("td")
    .each((_index, element) => {
      keys.push($(element).text().trim());
    });

  rows.slice(1).each((_rowIndex, rowElement) => {
    const rowData: { [key: string]: string } = {};
    const columns = $(rowElement).find("td");

    columns.each((colIndex, colElement) => {
      const columnName = keys[colIndex] || `col${colIndex + 1}`;
      const columnData = $(colElement).text().trim();
      rowData[columnName] = columnData;
    });

    tableData.push(rowData);
  });

  return tableData;
}

export { scrapeHRefsTeamsFrommAICSWebSite, scrapeHRefsFrommAICSWebSite, scrapeTableFromAICSWebSite, scrapeHRefsTournaments };
