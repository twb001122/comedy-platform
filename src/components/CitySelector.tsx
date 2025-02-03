'use client';

import { Select } from 'antd';
import citiesData from '@/data/cities.json';

interface CitySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * 城市选择器组件
 */
export default function CitySelector({ value, onChange }: CitySelectorProps) {
  const options = citiesData.provinces.flatMap(province => 
    province.cities.map(city => ({
      label: `${province.name} - ${city.name}`,
      value: `${province.name} - ${city.name}`
    }))
  );

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      placeholder="请选择城市"
      filterOption={(input, option) =>
        (option?.label as string).toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />
  );
} 