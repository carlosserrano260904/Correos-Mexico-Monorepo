import { createElement } from 'react';
import { GuiaMapper } from '../../mappers/guia.mapper';

type GuiaPdfPayload = ReturnType<typeof GuiaMapper.toPdfPayload>;

export const plantillaGuiaNacional = async (
  guiaData: GuiaPdfPayload,
  qrCodeDataURL: string,
): Promise<any> => { // <--- AGREGAR ESTO AQUÍ TAMBIÉN
  const { Document, Page, Text, View, StyleSheet, Image } = await import(
    '@react-pdf/renderer'
  );

  // ... (El resto del código sigue igual)
  const styles = StyleSheet.create({
    page: {
      padding: 0,
      fontFamily: 'Helvetica',
      fontSize: 10,
      backgroundColor: '#ffffff',
    },
    postalLabel: {
      width: '100%',
      backgroundColor: 'white',
      border: '3px solid black',
      margin: '0 auto',
    },
    header: {
      borderBottom: '2px solid black',
      padding: 10,
      textAlign: 'center',
      backgroundColor: 'white',
    },
    headerTitle: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 10,
      border: '1px solid black',
      padding: 5,
    },
    serviceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    logo: {
      width: 80,
      height: 60,
      // backgroundColor: "#e91e63",
      // display: "flex",
      // alignItems: "center",
      // justifyContent: "center",
      // color: "white",
      // fontWeight: "bold",
      // fontSize: 10,
      // textAlign: "center",
    },
    serviceTitle: {
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 20,
    },
    serviceTitleMain: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: 0,
    },
    serviceTitleSub: {
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 5,
    },
    infoFields: {
      textAlign: 'right',
      fontSize: 11,
    },
    infoField: {
      marginVertical: 3,
    },
    senderSection: {
      flexDirection: 'row',
      borderBottom: '1px solid black',
      minHeight: 80,
    },
    senderLeft: {
      flex: 1,
      padding: 10,
      borderRight: '1px solid black',
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 10,
    },
    adminSection: {
      padding: 10,
      borderBottom: '2px solid black',
      minHeight: 40,
    },
    barcodeSection: {
      textAlign: 'center',
      padding: 15,
      borderBottom: '2px solid black',
    },
    barcodeNumber: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 5,
      fontFamily: 'Courier',
    },
    recipientSection: {
      minHeight: 120,
      padding: 10,
      borderBottom: '1px solid black',
    },
    addressBox: {
      height: 60,
      border: '1px solid #ccc',
      marginTop: 10,
      padding: 5,
    },
    termsSection: {
      fontSize: 8,
      padding: 5,
      borderBottom: '1px solid black',
      lineHeight: 1.2,
    },
    qrSection: {
      flexDirection: 'row',
      borderBottom: '1px solid black',
      padding: 10,
      alignItems: 'center',
    },
    qrLeft: {
      flex: 1,
    },
    qrRight: {
      alignItems: 'center',
      width: 100,
    },
    qrCode: {
      width: 70,
      height: 70,
      marginBottom: 5,
    },
    qrText: {
      fontSize: 8,
      textAlign: 'center',
      color: '#666666',
    },
    instructionsTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333333',
    },
    instructionsText: {
      fontSize: 8,
      lineHeight: 1.3,
      color: '#666666',
    },
    footerInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      fontSize: 11,
      borderBottom: '1px solid black',
    },
    footerLeft: {
      flex: 1,
    },
    footerRight: {
      textAlign: 'right',
      fontWeight: 'bold',
    },
    declarations: {
      padding: 5,
      paddingHorizontal: 10,
      fontSize: 10,
      borderBottom: '1px solid black',
    },
    receiptSection: {
      textAlign: 'center',
      padding: 10,
      borderBottom: '1px solid black',
    },
    receiptTitle: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 10,
    },
    finalNote: {
      fontSize: 8,
      padding: 5,
      lineHeight: 1.3,
    },
    boldText: {
      fontWeight: 'bold',
    },
    addressText: {
      fontSize: 8,
      marginTop: 1,
    },
  });

  const formatAddress = (
    direccion: GuiaPdfPayload['remitente']['direccion'],
  ) => {
    const parts: string[] = [];
    if (direccion.calle) parts.push(direccion.calle);
    if (direccion.numero) parts.push(`#${direccion.numero}`);
    if (direccion.numeroInterior)
      parts.push(`Int. ${direccion.numeroInterior}`);

    const line1 = parts.join(' ');
    const line2 = `${direccion.asentamiento}, ${direccion.localidad}`;
    const line3 = `${direccion.localidad}, ${direccion.estado}, ${direccion.pais}`;
    const line4 = `C.P. ${direccion.codigoPostal}`;
    const line5 = direccion.referencia ? `Ref: ${direccion.referencia}` : '';

    return { line1, line2, line3, line4, line5 };
  };

  const renderAddressBox = (
    persona: GuiaPdfPayload['remitente'] | GuiaPdfPayload['destinatario'],
  ) => {
    const fullName = `${persona.nombres} ${persona.apellidos}`;
    const address = formatAddress(persona.direccion);

    return createElement(
      View,
      { style: styles.addressBox },
      createElement(
        Text,
        { style: { fontSize: 9, fontWeight: 'bold' } },
        fullName,
      ),
      createElement(Text, { style: styles.addressText }, address.line1),
      createElement(Text, { style: styles.addressText }, address.line2),
      createElement(Text, { style: styles.addressText }, address.line3),
      createElement(Text, { style: styles.addressText }, address.line4),
      createElement(
        Text,
        { style: styles.addressText },
        `Tel: ${persona.TelefonoVO}`,
      ),
      address.line5
        ? createElement(Text, { style: styles.addressText }, address.line5)
        : null,
    );
  };

  return createElement(
    Document,
    {},
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      createElement(
        View,
        { style: styles.postalLabel },
        // Header
        createElement(
          View,
          { style: styles.header },
          createElement(
            Text,
            { style: styles.headerTitle },
            'Etiqueta Adherible SIO MEXPOST, Nacional e Internacional SPM-CGLO-13',
          ),
          createElement(
            View,
            { style: styles.serviceInfo },
            createElement(Image, {
              style: styles.logo,
              src: './src/guias_trazabilidad/infrastructure/pdf-generator/plantillas/icons/correos-mexico.jpg',
            }),
            createElement(
              View,
              { style: styles.serviceTitle },
              createElement(
                Text,
                { style: styles.serviceTitleMain },
                'SERVICIO POSTAL MEXICANO',
              ),
              createElement(
                Text,
                { style: styles.serviceTitleSub },
                'MENSAJERÍA NACIONAL E INTERNACIONAL',
              ),
            ),
            createElement(
              View,
              { style: styles.infoFields },
              createElement(
                View,
                { style: styles.infoField },
                createElement(Text, {}, 'Fecha: ___________'),
              ),
              createElement(
                View,
                { style: styles.infoField },
                createElement(
                  Text,
                  {},
                  `C.P.: ${guiaData.remitente.direccion.codigoPostal}`,
                ),
              ),
              createElement(
                View,
                { style: styles.infoField },
                createElement(Text, {}, 'Tarifa: __________'),
              ),
              createElement(
                View,
                { style: styles.infoField },
                createElement(Text, {}, `Peso: ${guiaData.embalaje.peso} kg`),
              ),
            ),
          ),
        ),

        // Sender Section
        createElement(
          View,
          { style: styles.senderSection },
          createElement(
            View,
            { style: styles.senderLeft },
            createElement(
              Text,
              { style: styles.sectionTitle },
              'Remitente (Shipper)',
            ),
            renderAddressBox(guiaData.remitente),
          ),
        ),

        // Administration
        createElement(
          View,
          { style: styles.adminSection },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'Administración: _______________',
          ),
        ),

        // Barcode Section
        createElement(
          View,
          { style: styles.barcodeSection },
          createElement(
            Text,
            { style: styles.barcodeNumber },
            guiaData.numeroRastreo,
          ),
        ),

        // Recipient Section
        createElement(
          View,
          { style: styles.recipientSection },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'Destinatario (Consignee)',
          ),
          renderAddressBox(guiaData.destinatario),
        ),

        // Terms
        createElement(
          View,
          { style: styles.termsSection },
          createElement(
            Text,
            {},
            '"QUE ACEPTA LOS TÉRMINOS Y CONDICIONES DEL CONTRATO 2988-2006, EXP. PFC.B.E. 7/003309-2006, REGISTRADO EN LA PROFECO EL 1RO DE SEPTIEMBRE DE 2006".',
          ),
        ),

        // QR Section
        createElement(
          View,
          { style: styles.qrSection },
          createElement(
            View,
            { style: styles.qrLeft },
            createElement(
              Text,
              { style: styles.instructionsTitle },
              'INSTRUCCIONES DE ENTREGA',
            ),
            createElement(
              Text,
              { style: styles.instructionsText },
              'Para la entrega del paquete se requiere:\n' +
              '• Identificación oficial vigente\n' +
              '• Firma de recibido del destinatario\n' +
              '• Verificación de datos personales\n' +
              '• Presencia del destinatario o autorizado',
            ),
          ),
          createElement(
            View,
            { style: styles.qrRight },
            createElement(Image, {
              style: styles.qrCode,
              src: qrCodeDataURL,
            }),
            createElement(Text, { style: styles.qrText }, 'Código QR'),
          ),
        ),

        // Footer Info
        createElement(
          View,
          { style: styles.footerInfo },
          createElement(
            View,
            { style: styles.footerLeft },
            createElement(Text, { style: styles.boldText }, 'SEPOMEX'),
            createElement(
              Text,
              {},
              'Av. Ceylán No. 468 Col. Cosmopolita CD. MÉXICO, 02523',
            ),
          ),
          createElement(
            View,
            { style: styles.footerRight },
            createElement(Text, {}, 'EMS / --------'),
            createElement(Text, { style: styles.boldText }, 'MEXPOST'),
          ),
        ),

        // Declarations
        createElement(
          View,
          { style: styles.declarations },
          createElement(
            Text,
            {},
            createElement(Text, { style: styles.boldText }, 'ACLARACIONES'),
            '     Directo: 55-53-85-09-00 Ext. 45412 al 45430',
          ),
        ),

        // Receipt Section
        createElement(
          View,
          { style: styles.receiptSection },
          createElement(
            Text,
            { style: styles.receiptTitle },
            'ACUSE DE RECIBO',
          ),
          createElement(
            Text,
            { style: styles.barcodeNumber },
            guiaData.numeroRastreo,
          ),
        ),

        // Final Note
        createElement(
          View,
          { style: styles.finalNote },
          createElement(
            Text,
            {},
            createElement(Text, { style: styles.boldText }, 'NOTA: '),
            'Este formato se requisita electrónicamente en los puntos de venta y los datos se ingresan conforme los va solicitando el sistema, por lo que no cuenta con instructivo de llenado.',
          ),
        ),
      ),
    ),
  );
};
