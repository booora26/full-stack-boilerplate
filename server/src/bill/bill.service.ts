import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { writeFile, readFile } from 'fs/promises';

@Injectable()
export class BillService {
  async fillForm() {
    // const formUrl =
    //   'https://www.paragraf.rs/obrasci/Obrazac_br._1_-_Nalog_za_uplatu.pdf';
    // const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const file = await readFile('./src/bill/obrazac.pdf');
    const formPdfBytes = file;
    const pngImageBytes = await readFile('./src/bill/qr.png');

    // const marioUrl = 'https://pdf-lib.js.org/assets/small_mario.png';
    // const marioImageBytes = await fetch(marioUrl).then((res) =>
    //   res.arrayBuffer(),
    // );

    // const emblemUrl = 'https://pdf-lib.js.org/assets/mario_emblem.png';
    // const emblemImageBytes = await fetch(emblemUrl).then((res) =>
    //   res.arrayBuffer(),
    // );

    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // const marioImage = await pdfDoc.embedPng(marioImageBytes);
    // const emblemImage = await pdfDoc.embedPng(emblemImageBytes);

    const formNames = pdfDoc
      .getForm()
      .getFields()
      .map((f) => f.getName());

    const form = pdfDoc.getForm();

    console.log(formNames);

    const uplatilacField = form.getTextField(
      'topmostSubform[0].Page1[0].Z3[0]',
    );

    const svrhaField = form.getTextField('topmostSubform[0].Page1[0].Z3[1]');

    const primalacField = form.getTextField('topmostSubform[0].Page1[0].Z3[2]');

    const potpisField = form.getTextField('topmostSubform[0].Page1[0].Z3[9]');

    const sifraField = form.getTextField('topmostSubform[0].Page1[0].Z3[3]');

    const valutaField = form.getTextField('topmostSubform[0].Page1[0].Z3[4]');

    const iznosField = form.getTextField('topmostSubform[0].Page1[0].Z3[5]');

    const racunField = form.getTextField('topmostSubform[0].Page1[0].Z3[6]');

    const modelField = form.getTextField('topmostSubform[0].Page1[0].Z3[7]');

    const datumField = form.getTextField('topmostSubform[0].Page1[0].Z3[8]');
    const pozivField = form.getTextField('topmostSubform[0].Page1[0].Z3[10]');

    // const characterImageField = form.getButton('CHARACTER IMAGE');
    // const factionImageField = form.getButton('Faction Symbol Image');

    uplatilacField.setText(
      ['Boris Gluvacevic', 'Marka Celebonovica 25', 'Beograd'].join('\n'),
    );
    svrhaField.setText('Placanje racuna');
    primalacField.setText('Ivan Gluvacevic');
    sifraField.setText('281');
    valutaField.setText('RSD');
    iznosField.setText('=1000,00');
    racunField.setText('160-0000034564567-60');
    modelField.setText('97');
    datumField.setText('Beograd, 04.01.2023');
    pozivField.setText('45-5566');
    potpisField.setText('Boris');

    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const page = pdfDoc.getPage(0);

    const pngDims = pngImage.scale(0.2);

    page.drawImage(pngImage, {
      x: page.getWidth() - pngDims.width / 2 - 75,
      y: page.getHeight() - pngDims.height / 2 - 200,
      width: pngDims.width,
      height: pngDims.height,
    });

    // factionField.setText(`Mario's Emblem`);

    // factionImageField.setImage(emblemImage);

    // backstoryField.setText(
    //   [
    //     `Mario is a fictional character in the Mario video game franchise, `,
    //     `owned by Nintendo and created by Japanese video game designer Shigeru `,
    //     `Miyamoto. Serving as the company's mascot and the eponymous `,
    //     `protagonist of the series, Mario has appeared in over 200 video games `,
    //     `since his creation. Depicted as a short, pudgy, Italian plumber who `,
    //     `resides in the Mushroom Kingdom, his adventures generally center `,
    //     `upon rescuing Princess Peach from the Koopa villain Bowser. His `,
    //     `younger brother and sidekick is Luigi.`,
    //   ].join('\n'),
    // );

    // traitsField.setText(
    //   [
    //     `Mario can use three basic three power-ups:`,
    //     `  • the Super Mushroom, which causes Mario to grow larger`,
    //     `  • the Fire Flower, which allows Mario to throw fireballs`,
    //     `  • the Starman, which gives Mario temporary invincibility`,
    //   ].join('\n'),
    // );

    // treasureField.setText(['• Gold coins', '• Treasure chests'].join('\n'));

    const pdfBytes = await pdfDoc.save();

    await writeFile('./src/bill/output.pdf', pdfBytes);
  }
}
