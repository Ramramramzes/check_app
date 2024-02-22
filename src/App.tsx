import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TestList } from "./TestList";
import { TestItem } from './TestItem';
import axios from 'axios';
import { Resultpage } from './Resultpage';

// Интерфейс для данных строки теста
interface IRowData {
  id: number;
  body: string;
  move: string;
  what: string;
  done: number;
}

// Интерфейс для таблицы с данными
interface ITable {
  [key: string]: IRowData[];
}

// Интерфейс для списка таблиц
interface ITableList {
  body: string;
}

export function App() {
  // Состояние для таблиц и списка таблиц
  const [tables, setTables] = useState<ITable>({ test_data: [], result_table: [] });
  const [tablesList, setTablesList] = useState<ITableList[]>([]);
  // Состояние для отслеживания текущей страницы
  const [isPage, setPage] = useState('*');

  useEffect(() => {
    // Функция для получения данных
    async function fetchData() {
      try {
        // Запрос списка и элементов таблиц
        const [listResponse, itemResponse] = await Promise.all([
          axios.get('http://localhost:3001/list'), //? меняем_тут
          axios.get('http://localhost:3001/item') //? меняем_тут 
        ]);

        // Проверка статуса ответа
        if (listResponse.status !== 200 || itemResponse.status !== 200) {
          throw new Error('Ошибка при получении данных');
        }

        // Извлечение данных из ответов
        const listData: ITableList[] = listResponse.data;
        const itemData: ITable = itemResponse.data;
        // Удаление ненужной таблицы из данных элементов
        delete itemData.result_table;

        // Установка полученных данных в состояния
        setTablesList(listData);
        setTables(itemData);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }

    // Вызов функции получения данных
    fetchData();
  }, [isPage]); // Зависимость, чтобы данные были получены при изменении страницы

  return (
    <BrowserRouter>
      <Routes>
        {/* Маршрут для отображения списка */}
        <Route path="*" element={<TestList tables={tablesList} setPage={setPage} />} />
        {/* Маршрут для отображения элемента */}
        <Route path="/:isPage" element={<TestItem tables={tables} setPage={setPage} isPage={isPage} title={tablesList[Number(isPage)-1] ? tablesList[Number(isPage)-1].body : ''} />} />
        {/* Маршрут для отображения страницы результата */}
        <Route path="/result" element={<Resultpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
