import { NextApiRequest, NextApiResponse } from 'next';
import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export default async (req: NextApiRequest, res: NextApiResponse) => {

    //const saveAsPdf = async (url: string) => {
    //   const browser = await puppeteer.launch();
    //   const page = await browser.newPage();

    //   await page.goto(url, {
    //       waitUntil: 'networkidle0'
    //     });

    //   const result = await page.pdf({
    //     format: 'a4',
    //   });
    //   await browser.close();

    //   return result;
    // };

    // export default async (req: NextApiRequest, res: NextApiResponse) => {
    //   const { url } = req.query; // pass the page to create PDF from as param

    //   res.setHeader(
    //     'Content-Disposition',
    //     `attachment; filename="file.pdf"`
    //   );
    //   res.setHeader('Content-Type', 'application/pdf');

    //   const pdf = await saveAsPdf(url as string);

    //   return res.send(pdf);

    const query = req.query
    const url = query.url;
    //  Open chrome
    const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE

    const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: true,
    });
    const page = await browser.newPage();

    await page.goto(url as string, {
        waitUntil: 'networkidle0'
    });

    const result = await page.pdf({
        format: 'a4',
    });
    await browser.close();

    return result;
};