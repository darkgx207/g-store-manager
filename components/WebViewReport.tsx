import { OrderResume } from "@/database/models/OrderResume";
import { ItemsReport } from "@/database/models/Report";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface IWebViewReportProps {
  report?: OrderResume[],
  inicio: string,
  fim: string
}

export function WebViewReport(props: IWebViewReportProps) {
  const generateResume = () => {
    let str = "";
    props.report?.forEach(r => {
      const pedido = r.id || "indefinido";
      const total = r.total;
      const datetime = ((r.updatedAt || r.createdAt)?.toString() || "").split('T');
      const date = datetime[0].replace(/\-/g,'/');
      const hrs = datetime[1].slice(0,8)

      str += `Pedido:${pedido} <br>(${date} - ${hrs}) <b>Total:</b> R$ ${total || 0} <br/>`;
      r.items?.forEach(i => {
        const title = i.title;
        const qnt = i.quantity;
        const price = i.total;
        str += `<b>${title}</b>,  <b>quantidade:</b> ${qnt},  <b?valor:</b> <b>Valor:</b> R$ ${price} <br/>`;
      })
      str += "<br><br>"
    });
    str += "----------------------------------<br>" + "Total: R$ 99999";
    return str;
  }

  const html = `
    <html>
      <body style="background-color: white; font-size: 2rem">
        <pre><b>Relatório de vendas</b>\n(${props.inicio} até ${props.fim})</pre>
        <hr/>
        ${!(props.report && props.report.length) ?
          '<pre> Nenhum registro encontrado neste periodo.</pre>':
          generateResume()}
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ html }}
      >

      </WebView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webview: {
    height: 300,
  }
});
