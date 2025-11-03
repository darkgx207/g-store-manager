
import { UnidadeVendas } from '@/constants/constantValues';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface IRadioSelectProps {
  onChange: (value: string) => void,
  options: string[],
  label: string,
  defaultValue?: string
}

interface IRadioButtonProps {
  label: string,
  selected: boolean,
  onSelect: () => void
}

export function RadioButton({ label, selected, onSelect }: IRadioButtonProps ) {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
      <View style={styles.radioRing}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}


export function RadioSelect(props: IRadioSelectProps) {
  const [selectedValue, setSelectedValue] = useState(props.defaultValue || props.options[0]);
  
  useEffect(() => {
    const currentValue = selectedValue; 
    props.onChange(currentValue);
  }, [selectedValue]);

  return (
    <View style={styles.mainContainer}>
      {props.label && (
        <Text style={styles.header}>{props.label}:</Text>
      )}
      {props.options.map((item, key) => (
        <RadioButton
          label={item}
          selected={selectedValue === item}
          onSelect={() => setSelectedValue(item)}
          key={key}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
  },
  header: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: 'semibold',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioRing: {
    height: 18,
    width:18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF', // Standard blue color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioDot: {
    height: 9,
    width: 9,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 16,
  },
});
