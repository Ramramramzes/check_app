import express from 'express';
import { createConnection } from 'mysql';

const app = express();
app.use(express.json());

function connectToDatabase() {
  const connection = createConnection({
    host: 'mysql.j26063212.myjino.ru',
    user: 'j26063212_login',
    password: 'Marat642330',
    database: 'j26063212_check',
  });

  connection.connect((err) => {
    if (err) {
      console.error('Ошибка при подключении к базе данных:', err);
      setTimeout(reconnect, 2000);
    } else {
      console.log('Успешное подключение к базе данных');
    }
  });

  connection.on('error', (err) => {
    console.error('Ошибка соединения с базой данных:', err);
    reconnect();
  });

  return connection;
}

function reconnect() {
  console.log('Переподключение к базе данных...');
  connection = connectToDatabase();
}

let connection = connectToDatabase();


const queryTables = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "j26063212_check"';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

app.get('/item', (req, res) => {
  connection.query(queryTables, async (error, results) => {
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

app.listen(3001, () => {
  console.log(`Сервер запущен на порту ${3001}`);
});
