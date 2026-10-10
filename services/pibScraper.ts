import axios from 'axios';
import * as cheerio from 'cheerio';

export interface PIBScrapedArticle {
  title: string;
  ministry: string;
  date: string;
  pibId: string;
  url: string;
  summary: string;
  fullContent?: string;
}

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export class PIBScraper {
  private readonly baseUrl = 'https://www.pib.gov.in';

  /**
   * Scrape latest articles from PIB homepage (English press releases).
   * PIB renders a list/table-based layout; each press release link contains:
   *   - a href containing "PressReleaseDetail.aspx?PRID=<id>" (current site)
   *   - or "PressReleasePage.aspx?PRID=<id>" (older site/layout)
   *   - ministry name in a sibling <td>
   *   - date in another sibling <td>
   */
  async scrapeHomepage(): Promise<PIBScrapedArticle[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/index.aspx?reg=48&lang=2`, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: 30000,
      });

      const $ = cheerio.load(response.data);
      const articles: PIBScrapedArticle[] = [];
      const seen = new Set<string>();

      // Support both the current detail URL and the legacy page URL.
      $('a[href*="PressReleaseDetail.aspx"], a[href*="PressReleasePage.aspx"]').each((_, el) => {
        try {
          const $a = $(el);
          // The current homepage truncates link text, but keeps the complete
          // release title in the title attribute.
          const title = ($a.attr('title') || $a.text()).replace(/\s+/g, ' ').trim();
          if (!title || title.length < 10) return;

          const relHref = $a.attr('href') || '';
          const url = relHref.startsWith('http')
            ? relHref
            : `${this.baseUrl}/${relHref.replace(/^\//, '')}`;

          // Extract PRID from URL
          const pridMatch = url.match(/PRID=(\d+)/i);
          const prid = pridMatch ? pridMatch[1] : '';
          if (!prid || seen.has(prid)) return;
          seen.add(prid);

          const pibId = `PRID-${prid}`;

          // Walk up to the containing row to find ministry & date siblings
          const $row = $a.closest('tr');
          const cells = $row.find('td');
          let ministry = 'Government of India';
          let date = new Date().toISOString().split('T')[0];

          cells.each((_, td) => {
            const text = $(td).text().trim();
            // Date pattern: DD/MM/YYYY or YYYY-MM-DD
            if (/\d{2}\/\d{2}\/\d{4}/.test(text)) {
              const parts = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
              if (parts) date = `${parts[3]}-${parts[2]}-${parts[1]}`;
            } else if (/\d{4}-\d{2}-\d{2}/.test(text)) {
              date = text.match(/\d{4}-\d{2}-\d{2}/)![0];
            } else if (
              text.length > 5 &&
              text.length < 120 &&
              !text.includes(title.substring(0, 20))
            ) {
              // Heuristic: non-title, non-date cell is likely ministry
              if (text.toLowerCase().includes('ministr') || text.toLowerCase().includes('department') ||
                  text.toLowerCase().includes('cabinet') || text.toLowerCase().includes('commission') ||
                  text.toLowerCase().includes('authority') || text.toLowerCase().includes('council')) {
                ministry = text;
              }
            }
          });

          articles.push({ title, ministry, date, pibId, url, summary: title });
        } catch {
          // skip malformed entries
        }
      });

      // Deduplicate by pibId (already done via seen set) and limit to 20
      const result = articles.slice(0, 20);
      console.log(`Scraped ${result.length} articles from PIB homepage`);
      return result;
    } catch (error) {
      console.error('Error scraping PIB homepage:', error);
      throw new Error(
        `Failed to scrape PIB articles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Fetch full content of a PIB press release page.
   * PIB article pages use a div with id="ContentPlaceHolder1_lblPRContent" or similar.
   */
  async fetchArticleContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: 30000,
      });

      const $ = cheerio.load(response.data);

      // PIB-specific content containers (in priority order)
      const selectors = [
        '#ContentPlaceHolder1_lblPRContent',
        '.innner-page-content',
        '.release-content',
        '#release',
        '.content-area',
        'article',
        '.main-content',
      ];

      for (const sel of selectors) {
        const el = $(sel);
        if (el.length > 0) {
          const text = el.text().replace(/\s+/g, ' ').trim();
          if (text.length > 100) return text.substring(0, 4000);
        }
      }

      // Fallback: collect all paragraphs
      const paras = $('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 30)
        .join('\n\n');

      return paras.substring(0, 4000) || 'Content not available';
    } catch (error) {
      console.error(`Error fetching article content from ${url}:`, error);
      return 'Failed to fetch content';
    }
  }
}

export default PIBScraper;