import { createContext, useContext, useMemo, useState, useEffect } from 'react';

interface City {
  id: number;
  name: string;
}
interface Data {
  cities: City[];
}

export const defaultData: Data = {
  cities: [],
};

export type UseData = {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
};

export const useData = (initialData: Data = defaultData): UseData => {
  const [data, setData] = useState<Data>(defaultData);

  // Fetch cities on component mount (maybe  i should do it else where later)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8000/cities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setData((prevData) => ({ ...prevData, cities: result.cities }));
        } else {
          console.error('Failed to fetch cities:', result.errors);
        }
      } catch (error) {
        console.error('Could not fetch cities:', error);
      }
    };
    fetchCities();
  }, []);

  return { data, setData };
};

interface Props {
  children: React.ReactNode;
}

export const DataContext = createContext<UseData>(undefined!);

const DataProvider = ({ children }: Props) => {
  const { data, setData } = useData(defaultData);

  const value = useMemo(() => ({ data, setData }), [data, setData]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useDataContext = () => {
  return useContext(DataContext);
};

export { DataProvider, useDataContext };
