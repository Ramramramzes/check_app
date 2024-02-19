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

  export function App(){

    const [tables, setTables] = useState<ITable>({ test_data: [], result_table: [] });
    const [tablesList, setTablesList] = useState<ITableList[]>([]);
    const[isPage,setPage] = useState('*');

    // Инициализация состояния liStates внутри useEffect
    useEffect(() => {
      async function fetchDataList() {
        try {
          const response = await axios.get('http://localhost:3001/list');
          if (response.status !== 200) {
            throw new Error('Ошибка при получении данных');
          }
          const data: ITableList[] = response.data;

          setTablesList(data);
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }

      async function fetchDataItem() {
        try {
          const response = await axios.get('http://localhost:3001/item');
          if (response.status !== 200) {
            throw new Error('Ошибка при получении данных');
          }
          const data: ITable = response.data;
          delete data.result_table
          setTables(data);    
          
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }
  
      fetchDataList();
      fetchDataItem();
      
    }, [isPage]);
    
    return (
      <BrowserRouter>
      <Routes>
        {/* подстановочный путь */}
        <Route path="*" element={<TestList tables={tablesList} setPage={setPage}/>} />
        <Route path={"/:isPage"} element={< TestItem tables={tables} {...tables} setPage={setPage} isPage={isPage} title={tablesList[Number(isPage)-1] ? tablesList[Number(isPage)-1].body : ''}/>} />
        <Route path="/result" element={<Resultpage/>} />
      </Routes>
    </BrowserRouter>
    );
  }

export default App;
