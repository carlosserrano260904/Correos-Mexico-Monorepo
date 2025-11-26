import { GuiaMapper } from '../../mappers/guia.mapper';
import { createElement } from 'react';

type GuiaPdfPayload = ReturnType<typeof GuiaMapper.toPdfPayload>;

// Corregimos el nombre de la constante y forzamos el tipo de retorno
export const plantillaGuiaInternacional = async (
  guiaData: GuiaPdfPayload,
  qrCodeDataURL: string,
): Promise<any> => {
  // <--- ESTO (Promise<any>) ARREGLA EL ERROR TS2742
  const { Document, Page, Text, View, StyleSheet, Image } = await import(
    '@react-pdf/renderer'
  );
  const styles = StyleSheet.create({
    page: {
      padding: 0,
      fontFamily: 'Helvetica',
      fontSize: 7,
      backgroundColor: '#ffffff',
    },
    header: {
      backgroundColor: '#e91e63',
      padding: 8,
      marginBottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextContainer: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 8,
      color: '#ffffff',
      textAlign: 'center',
    },
    trackingSection: {
      backgroundColor: '#f5f5f5',
      padding: 6,
      borderBottomWidth: 1,
      borderBottomColor: '#e91e63',
    },
    trackingNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333333',
      letterSpacing: 1,
    },
    mainContent: {
      padding: 8,
    },
    twoColumnContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    leftColumn: {
      flex: 1,
      marginRight: 5,
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 6,
    },
    rightColumn: {
      flex: 1,
      marginLeft: 5,
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 6,
    },
    sectionTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0',
      padding: 3,
      marginBottom: 4,
      textAlign: 'center',
      color: '#333333',
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
    },
    fieldRow: {
      flexDirection: 'row',
      marginBottom: 2,
      paddingVertical: 1,
    },
    fieldLabel: {
      fontSize: 6,
      fontWeight: 'bold',
      width: 60,
      color: '#666666',
    },
    fieldValue: {
      fontSize: 6,
      flex: 1,
      color: '#000000',
    },
    fullWidthSection: {
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 6,
      marginBottom: 6,
    },
    packageInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    packageInfoBox: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 4,
      marginHorizontal: 1,
    },
    packageInfoTitle: {
      fontSize: 7,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 2,
      color: '#333333',
    },
    packageInfoValue: {
      fontSize: 8,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#e91e63',
    },
    qrSection: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 6,
      alignItems: 'center',
    },
    qrLeft: {
      flex: 1,
    },
    qrRight: {
      alignItems: 'center',
      width: 80,
    },
    qrCode: {
      width: 60,
      height: 60,
      marginBottom: 3,
    },
    qrText: {
      fontSize: 5,
      textAlign: 'center',
      color: '#666666',
    },
    instructionsTitle: {
      fontSize: 7,
      fontWeight: 'bold',
      marginBottom: 3,
      color: '#333333',
    },
    instructionsText: {
      fontSize: 5,
      lineHeight: 1.2,
      color: '#666666',
    },
    footer: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      right: 8,
      borderTopWidth: 1,
      borderTopColor: '#cccccc',
      paddingTop: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    footerLogo: {
      width: 120,
      height: 80,
      marginRight: 10,
    },
    footerTextContainer: {
      flex: 1,
    },
    footerText: {
      fontSize: 5,
      textAlign: 'center',
      color: '#999999',
    },
    checkboxSection: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 2,
    },
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
      marginBottom: 2,
    },
    checkbox: {
      width: 8,
      height: 8,
      borderWidth: 1,
      borderColor: '#333333',
      marginRight: 2,
    },
    checkboxLabel: {
      fontSize: 5,
      color: '#333333',
    },
    signatureBox: {
      borderWidth: 1,
      borderColor: '#cccccc',
      height: 25,
      marginTop: 3,
      padding: 2,
    },
    signatureLabel: {
      fontSize: 5,
      color: '#666666',
    },
    deliverySection: {
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 5,
      marginBottom: 5,
    },
    returnSection: {
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 4,
      marginBottom: 5,
    },
    officeSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    officeBox: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 4,
      marginHorizontal: 1,
    },
  });

  const renderField = (label: string, value: string | number) => {
    return createElement(
      View,
      { style: styles.fieldRow },
      createElement(Text, { style: styles.fieldLabel }, label + ':'),
      createElement(Text, { style: styles.fieldValue }, String(value || 'N/A')),
    );
  };

  return createElement(
    Document,
    {},
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      // header con logo
      createElement(
        View,
        { style: styles.header },
        createElement(
          View,
          { style: styles.headerTextContainer },
          createElement(
            Text,
            { style: styles.headerTitle },
            'SERVICIO POSTAL MEXICANO',
          ),
          createElement(
            Text,
            { style: styles.headerSubtitle },
            'CORREOS DE MÉXICO',
          ),
        ),
      ),

      // numero de rastreo
      createElement(
        View,
        { style: styles.trackingSection },
        createElement(
          Text,
          { style: styles.trackingNumber },
          guiaData.numeroRastreo,
        ),
      ),

      // informacion de oficinas
      createElement(
        View,
        { style: { ...styles.officeSection, paddingHorizontal: 8 } },
        createElement(
          View,
          { style: styles.officeBox },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'OFICINA ORIGEN / HOME OFFICE',
          ),
          createElement(
            Text,
            { style: { fontSize: 6, marginTop: 2 } },
            'Nombre: ___________________',
          ),
          createElement(
            Text,
            { style: { fontSize: 6, marginTop: 1 } },
            'Fecha: ____________________',
          ),
        ),
        createElement(
          View,
          { style: styles.officeBox },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'OFICINA DESTINO / DESTINATION OFFICE',
          ),
          createElement(
            Text,
            { style: { fontSize: 6, marginTop: 2 } },
            'Nombre: ___________________',
          ),
          createElement(
            Text,
            { style: { fontSize: 6, marginTop: 1 } },
            'Código: ___________________',
          ),
        ),
      ),

      // cuerpo
      createElement(
        View,
        { style: styles.mainContent },
        // informacion del paquete
        createElement(
          View,
          { style: styles.packageInfoContainer },
          createElement(
            View,
            { style: styles.packageInfoBox },
            createElement(
              Text,
              { style: styles.packageInfoTitle },
              'VALOR DECLARADO',
            ),
            createElement(
              Text,
              { style: styles.packageInfoValue },
              `$${guiaData.valorDeclarado}`,
            ),
          ),
          createElement(
            View,
            { style: styles.packageInfoBox },
            createElement(
              Text,
              { style: styles.packageInfoTitle },
              'PESO (KG)',
            ),
            createElement(
              Text,
              { style: styles.packageInfoValue },
              guiaData.embalaje.peso,
            ),
          ),
          createElement(
            View,
            { style: styles.packageInfoBox },
            createElement(
              Text,
              { style: styles.packageInfoTitle },
              'DIMENSIONES (CM)',
            ),
            createElement(
              Text,
              { style: styles.packageInfoValue },
              `${guiaData.embalaje.largo}x${guiaData.embalaje.ancho}x${guiaData.embalaje.alto}`,
            ),
          ),
        ),

        createElement(
          View,
          { style: styles.twoColumnContainer },
          // info del remitente
          createElement(
            View,
            { style: styles.leftColumn },
            createElement(
              Text,
              { style: styles.sectionTitle },
              'REMITENTE (SENDER)',
            ),
            renderField(
              'Nombre',
              `${guiaData.remitente.nombres} ${guiaData.remitente.apellidos}`,
            ),
            renderField('Teléfono', guiaData.remitente.TelefonoVO),
            renderField('Calle', guiaData.remitente.direccion.calle),
            renderField('Número', guiaData.remitente.direccion.numero),
            renderField('No. Int', guiaData.remitente.direccion.numeroInterior),
            renderField(
              'Asentamiento',
              guiaData.remitente.direccion.asentamiento,
            ),
            renderField('C.P.', guiaData.remitente.direccion.codigoPostal),
            renderField('Localidad', guiaData.remitente.direccion.localidad),
            renderField('Estado', guiaData.remitente.direccion.estado),
            renderField('País', guiaData.remitente.direccion.pais),
            renderField('Referencia', guiaData.remitente.direccion.referencia),
          ),
          // info del destinatario
          createElement(
            View,
            { style: styles.rightColumn },
            createElement(
              Text,
              { style: styles.sectionTitle },
              'DESTINATARIO (ADDRESSEE)',
            ),
            renderField(
              'Nombre',
              `${guiaData.destinatario.nombres} ${guiaData.destinatario.apellidos}`,
            ),
            renderField('Teléfono', guiaData.destinatario.TelefonoVO),
            renderField('Calle', guiaData.destinatario.direccion.calle),
            renderField('Número', guiaData.destinatario.direccion.numero),
            renderField(
              'No. Int',
              guiaData.destinatario.direccion.numeroInterior,
            ),
            renderField(
              'Asentamiento',
              guiaData.destinatario.direccion.asentamiento,
            ),
            renderField('C.P.', guiaData.destinatario.direccion.codigoPostal),
            renderField('Localidad', guiaData.destinatario.direccion.localidad),
            renderField('Estado', guiaData.destinatario.direccion.estado),
            renderField('País', guiaData.destinatario.direccion.pais),
            renderField(
              'Referencia',
              guiaData.destinatario.direccion.referencia,
            ),
          ),
        ),

        // declaraciones
        createElement(
          View,
          { style: styles.fullWidthSection },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'DECLARACIONES (CUSTOM DECLARATIONS)',
          ),
          // contenido
          createElement(
            Text,
            { style: { fontSize: 7, fontWeight: 'bold', marginBottom: 2 } },
            'CONTENIDO:',
          ),
          createElement(
            View,
            { style: styles.checkboxSection },
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Documento'),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Mercancía'),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Muestra'),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Regalos'),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(
                Text,
                { style: styles.checkboxLabel },
                'En Devolución',
              ),
            ),
          ),
          // documentacion
          createElement(
            Text,
            {
              style: {
                fontSize: 7,
                fontWeight: 'bold',
                marginTop: 4,
                marginBottom: 2,
              },
            },
            'DOCUMENTOS:',
          ),
          createElement(
            View,
            { style: styles.checkboxSection },
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Factura'),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(
                Text,
                { style: styles.checkboxLabel },
                'Cert. Origen',
              ),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Licencia'),
            ),
          ),
          // extras
          createElement(
            View,
            { style: { marginTop: 4 } },
            createElement(
              Text,
              { style: { fontSize: 6 } },
              'Descripción: ________________________________ Contrato: ____________',
            ),
            createElement(
              Text,
              { style: { fontSize: 6, marginTop: 1 } },
              'Forma de Pago: _____________ Seguro: _______ No. Factura: _____________ Valor: $ _______',
            ),
          ),
        ),

        // envio
        createElement(
          View,
          { style: styles.deliverySection },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'DATOS DEL ENVÍO - ACCEPTANCE',
          ),
          createElement(
            View,
            {
              style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 3,
              },
            },
            createElement(Text, { style: { fontSize: 6 } }, 'Peso: _____ Kg'),
            createElement(Text, { style: { fontSize: 6 } }, 'Costo: $ _______'),
            createElement(Text, { style: { fontSize: 6 } }, 'IVA: $ _______'),
            createElement(Text, { style: { fontSize: 6 } }, 'TOTAL: $ _______'),
          ),
          createElement(
            View,
            { style: styles.signatureBox },
            createElement(
              Text,
              { style: styles.signatureLabel },
              'Mensajero(a) Clave y Firma',
            ),
          ),
        ),

        // informacion del envio
        createElement(
          View,
          { style: styles.deliverySection },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'ENTREGA - DELIVERY',
          ),
          createElement(
            View,
            {
              style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 3,
              },
            },
            createElement(
              Text,
              { style: { fontSize: 6 } },
              'Fecha recibo: _________',
            ),
            createElement(
              Text,
              { style: { fontSize: 6 } },
              '1er Aviso: _________',
            ),
            createElement(
              Text,
              { style: { fontSize: 6 } },
              '2do Aviso: _________',
            ),
          ),
          createElement(
            Text,
            { style: { fontSize: 6, marginBottom: 3 } },
            'Fecha y Hora Entrega: _________________________',
          ),
          createElement(
            View,
            {
              style: { flexDirection: 'row', justifyContent: 'space-between' },
            },
            createElement(
              View,
              { style: { flex: 1, marginRight: 2 } },
              createElement(
                View,
                { style: styles.signatureBox },
                createElement(
                  Text,
                  { style: styles.signatureLabel },
                  'Nombre y firma destinatario',
                ),
              ),
            ),
            createElement(
              View,
              { style: { flex: 1, marginLeft: 2 } },
              createElement(
                View,
                { style: styles.signatureBox },
                createElement(
                  Text,
                  { style: styles.signatureLabel },
                  'Mensajero clave y firma',
                ),
              ),
            ),
          ),
        ),

        // retorno
        createElement(
          View,
          { style: styles.returnSection },
          createElement(
            Text,
            { style: styles.sectionTitle },
            'CAUSAS DE DEVOLUCIÓN',
          ),
          createElement(
            View,
            { style: styles.checkboxSection },
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(
                Text,
                { style: styles.checkboxLabel },
                'Dir. Incorrecta',
              ),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(
                Text,
                { style: styles.checkboxLabel },
                'Desconocido',
              ),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(Text, { style: styles.checkboxLabel }, 'Rehusado'),
            ),
            createElement(
              View,
              { style: styles.checkboxItem },
              createElement(View, { style: styles.checkbox }),
              createElement(
                Text,
                { style: styles.checkboxLabel },
                'No Localizado',
              ),
            ),
          ),
          createElement(
            Text,
            { style: { fontSize: 6, marginTop: 2 } },
            'Observaciones: ___________________________________',
          ),
        ),

        // qr
        createElement(
          View,
          { style: styles.qrSection },
          createElement(
            View,
            { style: styles.qrLeft },
            createElement(
              Text,
              { style: styles.instructionsTitle },
              'INSTRUCCIONES',
            ),
            createElement(
              Text,
              { style: styles.instructionsText },
              'Para entrega se requiere:\n' +
                '• ID oficial vigente • Firma de recibido\n' +
                '• Verificación de datos del destinatario',
            ),
          ),
          createElement(
            View,
            { style: styles.qrRight },
            createElement(Image, {
              style: styles.qrCode,
              src: qrCodeDataURL,
            }),
            createElement(Text, { style: styles.qrText }, 'Código de Rastreo'),
          ),
        ),
      ),

      // footer
      createElement(
        View,
        { style: styles.footer },
        createElement(Image, {
          style: styles.footerLogo,
          src: './src/guias_trazabilidad/infrastructure/pdf-generator/plantillas/icons/correos-mexico.jpg',
        }),
        createElement(
          View,
          { style: styles.footerTextContainer },
          createElement(
            Text,
            { style: styles.footerText },
            'Guía de paquetería - Conserve este comprobante',
          ),
        ),
      ),
    ),
  );
};
