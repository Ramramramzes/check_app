import express from 'express'; 
import { createConnection } from 'mysql'; 

const app = express(); // Создание экземпляра приложения Express
app.use(express.json()); // Подключение middleware для работы с JSON
// Подключение middleware для обслуживания статических файлов 
app.use(express.static('dist')); //? меняем_тут / выбираем путь до билда index.html из папки запуска

// Функция для соединения с базой данных MySQL
function connectToDatabase() {
  const connection = createConnection({
    host: 'localhost', //? меняем_тут
    user: 'root', //? меняем_тут
    password: 'root', //? меняем_тут
    database: 'forms_project', //? меняем_тут
  });

  // Обработчик события подключения к базе данных
  connection.connect((err) => {
    if (err) {
      console.error('Ошибка при подключении к базе данных:', err);
      setTimeout(reconnect, 2000);
    } else {
      console.log('Успешное подключение к базе данных');
    }
  });

  // Обработчик события ошибки соединения с базой данных
  connection.on('error', (err) => {
    console.error('Ошибка соединения с базой данных:', err);
    reconnect();
  });

  return connection;
}

// Функция для переподключения к базе данных
function reconnect() {
  console.log('Переподключение к базе данных...');
  connection = connectToDatabase();
}

let connection = connectToDatabase(); // Установка соединения с базой данных

// Запрос списка таблиц
const queryTables = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "forms-project"';  //? меняем_тут / название своей бд

// Middleware для CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Обработчик GET запроса для получения списка
app.get('/list', (req, res) => {
  connection.query(queryTables, async (error, results) => {
    if (error) {
      console.error('Ошибка выполнения SQL запроса:', error);
      res.status(500).json({ error: 'Ошибка при получении данных из базы данных' });
      return;
    }
    const queryTableData = `SELECT * FROM test_titles`;
    try {
      const tableResults = await query(queryTableData);
      res.json(tableResults)
    } catch (error) {
      console.error('Ошибка выполнения SQL запроса для таблицы test_titles');
      console.log(results);
    }
  });
});

// Запрос элементов таблицы
const queryTablesItem = 'SELECT table_name FROM information_schema.tables WHERE table_name LIKE "test_data%"'; //? меняем_тут / название своих тестов у меня они идут test_data_1 , test_data_2 , test_data_3 ...

// Обработчик GET запроса для получения элементов таблицы
app.get('/item', (req, res) => {
  connection.query(queryTablesItem, async (error, results) => {
    if (error) {
      console.error('Ошибка выполнения SQL запроса:', error);
      res.status(500).json({ error: 'Ошибка при получении данных из базы данных' });
      return;
    }

    const tables = results.map(row => row.table_name);
    const tableData = {};

    for (const table of tables) {
      const queryTableData = `SELECT * FROM ${table}`;
      try {
        const tableResults = await query(queryTableData);
        tableData[table] = tableResults;
      } catch (error) {
        console.error('Ошибка выполнения SQL запроса для таблицы', table, ':', error);
        tableData[table] = { error: 'Ошибка при получении данных из таблицы' };
      }
    }

    res.json(tableData);
  });
});

// Обработчик POST запроса для сохранения результатов тестирования
app.post('/api/result', async (req, res) => {
  const { test_name, student, student_res, date } = req.body;

  const queryInsert = `INSERT INTO result_table ( test_name, student, student_res, date) VALUES ( '${test_name}', '${student}', '${JSON.stringify(student_res)}', '${date}')`;
  try {
    await query(queryInsert, [test_name, student, student_res, date]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при добавлении данных в result_table:', error);
    res.status(500).json({ error: 'Ошибка при добавлении данных в базу данных' });
  }
});

// Функция для выполнения SQL запросов к базе данных
function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Порт, на котором запускается сервер 
const PORT = 3001; //? меняем_тут
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});