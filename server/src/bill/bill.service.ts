import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { writeFile, readFile } from 'fs/promises';
import { PaymentSlip } from './payment-slip.interface';

@Injectable()
export class BillService {
  async fillForm(paymentSlip: PaymentSlip) {
    const {
      payer,
      purposeOfPayment,
      payee,
      amount,
      payerAccountNumber,
      model,
      referenceNumber,
      paymentDate,
      paymentCode,
      payerSignature,
      currency,
    } = paymentSlip;
    // const formPdfBytes = await readFile('./src/bill/obrazac.pdf');
    const formPdfBytes = await readFile('./src/bill/obrazac_compressed.pdf');

    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // const marioImage = await pdfDoc.embedPng(marioImageBytes);
    // const emblemImage = await pdfDoc.embedPng(emblemImageBytes);

    // const formNames = pdfDoc
    //   .getForm()
    //   .getFields()
    //   .map((f) => f.getName());

    const form = pdfDoc.getForm();

    const payerField = form.getTextField('topmostSubform[0].Page1[0].Z3[0]');

    const purposeOfPaymentField = form.getTextField(
      'topmostSubform[0].Page1[0].Z3[1]',
    );

    const payeeField = form.getTextField('topmostSubform[0].Page1[0].Z3[2]');

    const signatureField = form.getTextField(
      'topmostSubform[0].Page1[0].Z3[9]',
    );

    const paymentCodeField = form.getTextField(
      'topmostSubform[0].Page1[0].Z3[3]',
    );

    const currencyField = form.getTextField('topmostSubform[0].Page1[0].Z3[4]');

    const amountField = form.getTextField('topmostSubform[0].Page1[0].Z3[5]');

    const accountField = form.getTextField('topmostSubform[0].Page1[0].Z3[6]');

    const modelField = form.getTextField('topmostSubform[0].Page1[0].Z3[7]');

    const dateField = form.getTextField('topmostSubform[0].Page1[0].Z3[8]');
    const referenceNumberField = form.getTextField(
      'topmostSubform[0].Page1[0].Z3[10]',
    );

    payerField.setText(payer.split(',').join('\n'));
    purposeOfPaymentField.setText(purposeOfPayment);
    payeeField.setText(payee.split(',').join('\n'));
    paymentCodeField.setText(paymentCode);
    currencyField.setText(currency);
    amountField.setText(`=${amount}`);
    accountField.setText(payerAccountNumber);
    modelField.setText(model);
    dateField.setText(paymentDate);
    referenceNumberField.setText(referenceNumber);
    signatureField.setText(payerSignature);

    const qr = await this.generateNBSQR(paymentSlip);
    const pngImage = await pdfDoc.embedPng(qr);

    const page = pdfDoc.getPage(0);

    const pngDims = pngImage.scale(0.35);

    page.drawImage(pngImage, {
      x: page.getWidth() - pngDims.width / 2 - 75,
      y: page.getHeight() - pngDims.height / 2 - 200,
      width: pngDims.width,
      height: pngDims.height,
    });

    const pdfBytes = await pdfDoc.save();

    await writeFile(`./src/bill/storage/${referenceNumber}.pdf`, pdfBytes);
  }

  async generateNBSQR(paymentSlip: PaymentSlip) {
    const {
      payer,
      purposeOfPayment,
      payee,
      amount,
      payerAccountNumber,
      model,
      referenceNumber,
      paymentDate,
      paymentCode,
      payerSignature,
      currency,
    } = paymentSlip;
    const body = JSON.stringify({
      K: 'PR',
      V: '01',
      C: '1',
      R: payerAccountNumber.replaceAll('-', ''),
      N: payer.split(',').join('\r\n'),
      I: `${currency}${amount}`,
      P: payee.split(',').join('\r\n'),
      SF: paymentCode,
      S: purposeOfPayment,
      RO: `${model}${referenceNumber}`,
    });
    console.log(body);

    const url = 'https://nbs.rs/QRcode/api/qr/v1/gen';

    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: body,
    };

    const response = await fetch(url, requestOptions);

    return await response.arrayBuffer();
  }
}
