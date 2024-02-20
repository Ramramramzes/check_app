import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TestList } from "./TestList";
import { TestItem } from './TestItem';
import axios from 'axios';
import { Resultpage } from './Resultpage';

interface IRowData {
  id: number;
  body: string;
  move: string;
  what: string;
  done: number;
}

interface ITable {
  [key: string]: IRowData[];
}

interface ITableList {
  body:string;
}

export function App() {
  const [tables, setTables] = useState<ITable>({ test_data: [], result_table: [] });
  const [tablesList, setTablesList] = useState<ITableList[]>([]);
  const [isPage, setPage] = useState('*');

  useEffect(() => {
    async function fetchData() {
      try {
        const [listResponse, itemResponse] = await Promise.all([
          axios.get('http://localhost:3001/list'),
          axios.get('http://localhost:3001/item')
        ]);

        if (listResponse.status !== 200 || itemResponse.status !== 200) {
          throw new Error('Ошибка при получении данных');
        }

        const listData: ITableList[] = listResponse.data;
        const itemData: ITable = itemResponse.data;
        delete itemData.result_table;

        setTablesList(listData);
        setTables(itemData);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }

    fetchData();
  }, [isPage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TestList tables={tablesList} setPage={setPage} />} />
        <Route path="/:isPage" element={<TestItem tables={tables} setPage={setPage} isPage={isPage} title={tablesList[Number(isPage)-1] ? tablesList[Number(isPage)-1].body : ''} />} />
        <Route path="/result" element={<Resultpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
