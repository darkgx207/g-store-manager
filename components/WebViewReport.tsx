import { ItemOrderDto } from "@/database/models/ItemOrderDto";
import { OrderResume } from "@/database/models/OrderResume";
import { ItemsReport } from "@/database/models/Report";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface IWebViewReportProps {
  report?: OrderResume[],
  inicio: string,
  fim: string,
  itemsReport?: ItemsReport[]
}

const style = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
      }
      th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
      }
      .header-pedido td {
        font-weight: bold;
        background-color: #dedede;
      }
      .item-name {
        width: 70%; /* Mais espaço para o nome do item */
      }
      .quantity, .price {
        width: 15%;
        text-align: center;
      }
      .total-row {
        font-weight: bold;
        text-align: right;
      }
      .total-row-label {
        text-align: right;
        font-weight: bold;
        background-color: #dedede;
      }
    </style>
`;

export function WebViewReport(props: IWebViewReportProps) {
  const generateItemsTable = () => {
    const itemsReport = props.itemsReport;
    if (!itemsReport) return "";

    let str = `
      <table style="font-size: 15pt">
      <thead>
        <tr class="header-pedido" style="color: red">
          <td colspan="3">Items Vendidos</td>
        </tr>
        <tr>
          <td class="quantity"><b>Nome</b></td>
          <td class="quantity"><b>Qnt</b></td>
          <td class="price"><b>valor total vendido (R$) </b></td>
        </tr>
      </thead>
      <tbody>
    `;

    itemsReport.forEach(i => {
      str += `
        <tr>
          <td class="item-name">${i.title}</td>
          <td class="quantity">${i.quantity} ${i.un?.slice(0,2)}</td>
          <td class="price">${i.revenue?.toFixed(2)}</td>
        </tr>`;
    });

    str += `
      </tbody>
      </table>
    `;
    return str;
  }

  const generateTable = () => {
    try {
      let str = "";
      props.report?.forEach(r => {
        const pedido = r.id || "indefinido";
        const total = r.total;
        const datetime = String((r.updatedAt || r.createdAt || 'xxxx-xx-xxT00:00:00')).split('T');
        const date = datetime[0].replace(/\-/g, '/');
        const hrs = datetime[1].slice(0, 8) || "";

        str += `
          <table style="font-size: 15pt">
          <thead>
            <tr class="header-pedido">
              <td colspan="3">Pedido: ${pedido}</td>
            </tr>
            <tr>
              <td>${date} - ${hrs}</td>
              <td class="quantity"><b>Qnt</b></td>
              <td class="price"><b>Total</b></td>
            </tr>
          </thead>
          <tbody>`;

        r.items?.forEach(i => {
          const title = i.title;
          const qnt = i.quantity;
          const price = i.total;

          str += `
          <tr>
            <td class="item-name">${title}</td>
            <td class="quantity">${qnt}</td>
            <td class="price">${price.toFixed(2)}</td>
          </tr>`;
        });
        str += `
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="1" style="border: none;"></td> <td class="total-row-label">Total (R$)</td>
            <td class="price">${total.toFixed(2)}</td>
          </tr>
        </tfoot>
        </table>
        <br><br>`;
      });
      str += `
        ${generateItemsTable()}
        <br><br>
        <pre>
          -------------------------------------------------
          Valor acumulado por periodo: R$ ${((props.report?.[0] as any).sum.max as number).toFixed(2)}
        </pre>
      `;
      return str;
    }
    catch (e) {
      console.error(e);
      return "<h2>Ocorreu um erro interno na aplicação</h2>"
    }
  };

  const html = `
    <html>
      <head>
        ${style}
      </head>
      <body style="background-color: white; font-size: 2rem">
        <pre><b>Relatório de vendas</b>\n(${props.inicio} até ${props.fim})</pre>
        <hr/>
        ${!(props.report && props.report.length) ?
          '<pre> Nenhum registro encontrado neste periodo.</pre>' : generateTable()
        }
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
