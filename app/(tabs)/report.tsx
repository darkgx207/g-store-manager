import { Platform, StyleSheet, Text, View } from "react-native";
import DatePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import GButton from "@/components/gButton";
import { WebViewReport } from "@/components/WebViewReport";
import { useDatabase } from "@/database/database";
import { OrderResume } from "@/database/models/OrderResume";


export default function Report() {
  const db = useDatabase();

  const [inicio, setInicio] = useState<Date>(new Date());
  const [fim, setFim] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState<'INICIO'|'FIM'|undefined>(undefined);
  const [report, setReport] = useState<OrderResume[]>([])

  const handleChangeDateButton = (current: 'INICIO'|'FIM') => {
    setCurrentDate(current);
    setShowCalendar(true);
  }

  const handleUpdateDate = (c: DateTimePickerEvent, value?: Date, current?: 'INICIO'|'FIM') => {
    if (c.type !== 'set') return;
    const newValue = value || new Date();

    if (current === 'INICIO') {
      if (newValue > fim) {
        setFim(newValue)
      }
      setInicio(newValue);

    } else {
      if (newValue < inicio) {
        setInicio(newValue)
      }
      setFim(newValue)
    };

    Platform.OS === 'android' && setShowCalendar(false);
  }

  const fetchReport = async () => {
    const r = await db.fetchItemOrder(undefined, true, { start: inicio, end: fim });
    setReport(r || [])
  }


  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {Platform.OS === "android" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: 'rgba(157, 206, 117, 0.85)' }}>
          <View style={[styles.search, { flex: 1}]}>
            <View>
              <GButton text="Definir inicio" color="green" style={styles.button}  onPress={() => handleChangeDateButton('INICIO')}/>
              <Text> {inicio.toLocaleDateString()} </Text>
            </View>
            <View>
              <GButton text="Definir fim" color="#900" style={styles.button}  onPress={() => handleChangeDateButton('FIM')}/>
              <Text> {fim.toLocaleDateString()} </Text>
            </View>
          </View>
          <GButton text="Buscar" color={"#919090"} style={[styles.button, { margin: 5 }]} onPress={fetchReport} />
        </View>
      )}

      {Platform.OS === "ios" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: 'rgba(157, 206, 117, 0.85)' }}>
          <View style={[styles.search, { flex: 1}]}>
            <View>
              <Text>Inicio: </Text>
              <DatePicker
                value={inicio}
                mode="date"
                timeZoneName="pt_BR"
                onChange={(event, value) => handleUpdateDate(event, value, 'INICIO')}
              />
            </View>
            <View>
              <Text>Fim: </Text>
              <DatePicker
                value={fim}
                mode="date"
                timeZoneName="pt_BR"
                onChange={(event, value) => handleUpdateDate(event, value, 'FIM')}
              />
            </View>
          </View>
          <GButton text="Buscar" color={"#919090"} style={[styles.button, { margin: 5 }]} />
        </View>
      )}

      {showCalendar && Platform.OS === "android" && (
        <DatePicker
          value={currentDate === 'INICIO' ? inicio : fim}
          mode="date"
          timeZoneName="pt_BR"
          onChange={(event, value) => handleUpdateDate(event, value, currentDate)}
          display="calendar"
        />
      )}
      <WebViewReport
        inicio = {inicio.toLocaleDateString()}
        fim = {fim.toLocaleDateString()}
        report={report}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    alignItems: "center",
    gap: 5,
    padding: 10,
    flexDirection: "row"
  },
  button: {
    padding: 5,
    borderRadius: 3,
    fontSize: 111
  }
})
