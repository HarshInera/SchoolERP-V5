const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

let db;

function initializeDatabase() {

  // Windows me writable application data folder
  const dataFolder = path.join(
    app.getPath("userData"),
    "Database"
  );

  // Database folder automatically create
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, {
      recursive: true
    });
  }

  // Main SQLite database
  const databasePath = path.join(
    dataFolder,
    "school.db"
  );

  db = new Database(databasePath);

  // Foreign key support
  db.pragma("foreign_keys = ON");

  // Better reliability/performance
  db.pragma("journal_mode = WAL");

  createTables();

  console.log(
    "School database ready:",
    databasePath
  );

  return db;
}


/* =========================================
   CREATE DATABASE TABLES
========================================= */

function createTables() {

  db.exec(`

    /* ==============================
       SCHOOL SETTINGS
    ============================== */

    CREATE TABLE IF NOT EXISTS school_settings (

      id INTEGER PRIMARY KEY CHECK(id = 1),

      school_name TEXT,
      subtitle TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      udise TEXT,
      session TEXT

    );


    /* ==============================
       SECURITY
    ============================== */

    CREATE TABLE IF NOT EXISTS security (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      username TEXT UNIQUE NOT NULL,

      password_hash TEXT NOT NULL,

      role TEXT NOT NULL DEFAULT 'admin'

    );


    /* ==============================
       CLASSES
    ============================== */

    CREATE TABLE IF NOT EXISTS classes (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT UNIQUE NOT NULL

    );


    /* ==============================
       SECTIONS
    ============================== */

    CREATE TABLE IF NOT EXISTS sections (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT UNIQUE NOT NULL

    );


    /* ==============================
       SUBJECTS
    ============================== */

    CREATE TABLE IF NOT EXISTS subjects (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT UNIQUE NOT NULL

    );


    /* ==============================
       CLASS SUBJECTS
    ============================== */

    CREATE TABLE IF NOT EXISTS class_subjects (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      class_name TEXT NOT NULL,

      subject_name TEXT NOT NULL,

      UNIQUE(class_name, subject_name)

    );


    /* ==============================
       FEE TYPES
    ============================== */

    CREATE TABLE IF NOT EXISTS fee_types (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT UNIQUE NOT NULL

    );


    /* ==============================
       STUDENTS
    ============================== */

    CREATE TABLE IF NOT EXISTS students (

      id TEXT PRIMARY KEY,

      name TEXT NOT NULL,

      father_name TEXT NOT NULL,

      mother_name TEXT,

      roll_number TEXT NOT NULL,

      admission_number TEXT,

      dob TEXT,

      class_name TEXT NOT NULL,

      section TEXT NOT NULL,

      phone TEXT,

      admission_date TEXT,

      transport_route TEXT,

      concession REAL DEFAULT 0,

      concession_reason TEXT,

      concession_remarks TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP

    );


    /* ==============================
       FEE STRUCTURE
    ============================== */

    CREATE TABLE IF NOT EXISTS fee_structures (

      id TEXT PRIMARY KEY,

      class_name TEXT NOT NULL,

      fee_type TEXT NOT NULL,

      amount REAL NOT NULL DEFAULT 0,

      frequency TEXT NOT NULL

    );


    /* ==============================
       FEE PAYMENTS
    ============================== */

    CREATE TABLE IF NOT EXISTS fee_payments (

      id TEXT PRIMARY KEY,

      receipt_number TEXT UNIQUE,

      student_id TEXT NOT NULL,

      fee_type TEXT NOT NULL,

      amount REAL NOT NULL,

      month TEXT,

      payment_mode TEXT,

      note TEXT,

      payment_date TEXT,

      payment_time TEXT,

      FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT

    );


    /* ==============================
       ATTENDANCE WORKING DAYS
    ============================== */

    CREATE TABLE IF NOT EXISTS attendance_working_days (

      id TEXT PRIMARY KEY,

      session TEXT NOT NULL,

      month TEXT NOT NULL,

      class_name TEXT NOT NULL DEFAULT 'ALL',

      working_days INTEGER NOT NULL,

      UNIQUE(session, month, class_name)

    );


    /* ==============================
       STUDENT ATTENDANCE
    ============================== */

    CREATE TABLE IF NOT EXISTS student_attendance (

      id TEXT PRIMARY KEY,

      student_id TEXT NOT NULL,

      session TEXT NOT NULL,

      month TEXT NOT NULL,

      class_name TEXT,

      section TEXT,

      working_days INTEGER NOT NULL,

      present_days INTEGER NOT NULL,

      absent_days INTEGER NOT NULL,

      percentage REAL NOT NULL,

      FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT,

      UNIQUE(student_id, session, month)

    );


    /* ==============================
       RESULTS
    ============================== */

    CREATE TABLE IF NOT EXISTS results (

      id TEXT PRIMARY KEY,

      student_id TEXT NOT NULL,

      session TEXT NOT NULL,

      exam_name TEXT NOT NULL,

      exam_date TEXT,

      total_marks REAL DEFAULT 0,

      obtained_marks REAL DEFAULT 0,

      percentage REAL DEFAULT 0,

      grade TEXT,

      result_status TEXT,

      FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT

    );


    /* ==============================
       RESULT SUBJECT MARKS
    ============================== */

    CREATE TABLE IF NOT EXISTS result_marks (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      result_id TEXT NOT NULL,

      subject_name TEXT NOT NULL,

      max_marks REAL NOT NULL,

      obtained_marks REAL NOT NULL,

      FOREIGN KEY(result_id)
        REFERENCES results(id)
        ON DELETE CASCADE

    );

        /* ==============================
       STUDENT REPORT CARDS
    ============================== */

    CREATE TABLE IF NOT EXISTS student_results (

      id TEXT PRIMARY KEY,

      student_id TEXT NOT NULL,

      session TEXT NOT NULL,

      working_days INTEGER DEFAULT 0,

      attendance_days INTEGER DEFAULT 0,

      remarks TEXT,

      promoted_to TEXT,

      next_session_date TEXT,

      activities_json TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      updated_at TEXT,

      UNIQUE(student_id, session),

      FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT

    );


    /* ==============================
       STUDENT RESULT SUBJECTS
    ============================== */

    CREATE TABLE IF NOT EXISTS student_result_marks (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      result_id TEXT NOT NULL,

      subject_name TEXT NOT NULL,


      quarterly_enabled INTEGER DEFAULT 1,

      quarterly_max REAL DEFAULT 0,

      quarterly_obtained REAL DEFAULT 0,


      half_yearly_enabled INTEGER DEFAULT 1,

      half_yearly_max REAL DEFAULT 0,

      half_yearly_obtained REAL DEFAULT 0,


      annual_enabled INTEGER DEFAULT 1,

      annual_max REAL DEFAULT 0,

      annual_obtained REAL DEFAULT 0,


      UNIQUE(result_id, subject_name),

      FOREIGN KEY(result_id)
        REFERENCES student_results(id)
        ON DELETE CASCADE

    );
  
    /* ==============================
       APP SETTINGS
    ============================== */

  CREATE TABLE IF NOT EXISTS app_settings (

   setting_key TEXT PRIMARY KEY,

    setting_value TEXT NOT NULL

   );
 `);

}


function getDatabase() {

  if (!db) {
    throw new Error(
      "Database has not been initialized."
    );
  }

  return db;
}

/* =========================================
   STUDENT DATABASE FUNCTIONS
========================================= */

function saveStudent(student) {

  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO students (
      id,
      name,
      father_name,
      mother_name,
      roll_number,
      admission_number,
      dob,
      class_name,
      section,
      phone,
      admission_date,
      transport_route,
      concession,
      concession_reason,
      concession_remarks
    )
    VALUES (
      @id,
      @name,
      @father,
      @mother,
      @roll,
      @admission,
      @dob,
      @className,
      @section,
      @phone,
      @admissionDate,
      @transportRoute,
      @concession,
      @concessionReason,
      @concessionRemarks
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      father_name = excluded.father_name,
      mother_name = excluded.mother_name,
      roll_number = excluded.roll_number,
      admission_number = excluded.admission_number,
      dob = excluded.dob,
      class_name = excluded.class_name,
      section = excluded.section,
      phone = excluded.phone,
      admission_date = excluded.admission_date,
      transport_route = excluded.transport_route,
      concession = excluded.concession,
      concession_reason = excluded.concession_reason,
      concession_remarks = excluded.concession_remarks
  `);

  stmt.run({
    id: student.id,
    name: student.name || "",
    father: student.father || "",
    mother: student.mother || "",
    roll: student.roll || "",
    admission: student.admission || "",
    dob: student.dob || "",
    className: student.className || "",
    section: student.section || "",
    phone: student.phone || "",
    admissionDate: student.admissionDate || "",
    transportRoute: student.transportRoute || "",
    concession: Number(student.concession) || 0,
    concessionReason: student.concessionReason || "",
    concessionRemarks: student.concessionRemarks || ""
  });

  return {
    success: true,
    id: student.id
  };
}


function getStudentById(id) {

  const db = getDatabase();

  return db.prepare(`
    SELECT

      id,

      name,

      father_name AS father,
      mother_name AS mother,

      roll_number AS roll,

      admission_number AS admission,

      dob,

      class_name AS className,

      section,

      phone,

      admission_date AS admissionDate,

      transport_route AS transportRoute,

      concession,

      concession_reason AS concessionReason,

      concession_remarks AS concessionRemarks

    FROM students

    WHERE id = ?
  `).get(id);
}


function deleteStudent(id) {

  const db = getDatabase();

  const student = db.prepare(`
    SELECT id
    FROM students
    WHERE id = ?
  `).get(id);

  if (!student) {

    return {
      success: false,
      message: "Student not found."
    };

  }

  /*
    Student ko tabhi delete karenge
    jab dependent records nahi hain.
  */

  const paymentCount = db.prepare(`
    SELECT COUNT(*) AS total
    FROM fee_payments
    WHERE student_id = ?
  `).get(id).total;

  const attendanceCount = db.prepare(`
    SELECT COUNT(*) AS total
    FROM student_attendance
    WHERE student_id = ?
  `).get(id).total;

  const resultCount = db.prepare(`
    SELECT COUNT(*) AS total
    FROM results
    WHERE student_id = ?
  `).get(id).total;


  if (
    paymentCount > 0 ||
    attendanceCount > 0 ||
    resultCount > 0
  ) {

    return {
      success: false,
      message:
        "Student has Fees, Attendance or Result records and cannot be deleted."
    };

  }


  db.prepare(`
    DELETE FROM students
    WHERE id = ?
  `).run(id);


  return {
    success: true
  };
}

function getStudents() {

  const db = getDatabase();

  return db.prepare(`
    SELECT
      id,
      name,
      father_name AS father,
      mother_name AS mother,
      roll_number AS roll,
      admission_number AS admission,
      dob,
      class_name AS className,
      section,
      phone,
      admission_date AS admissionDate,
      transport_route AS transportRoute,
      concession,
      concession_reason AS concessionReason,
      concession_remarks AS concessionRemarks

    FROM students

    ORDER BY
      class_name,
      section,
      roll_number,
      name
  `).all();

}

/* =========================================
   MASTER DATA
========================================= */

function getMasterTable(type) {

  const tables = {
    classes: "classes",
    sections: "sections",
    subjects: "subjects",
    feeTypes: "fee_types"
  };

  return tables[type] || null;
}


function addMasterData(type, value) {

  const db = getDatabase();

  const table = getMasterTable(type);

  if(!table){

    return {
      success: false,
      message: "Invalid master data type."
    };

  }


  value = String(value || "").trim();

  if(!value){

    return {
      success: false,
      message: "Value is required."
    };

  }


  try{

    db.prepare(`
      INSERT INTO ${table}
      (name)
      VALUES (?)
    `).run(value);


    return {
      success: true
    };


  }catch(error){

    /*
     SQLite UNIQUE constraint:
     same item duplicate nahi hoga.
    */

    if(
      String(error.message)
      .includes("UNIQUE")
    ){

      return {
        success: false,
        message: "This item already exists."
      };

    }

    throw error;

  }

}


function getMasterData() {

  const db = getDatabase();


  const getNames = (table) => {

    return db.prepare(`
      SELECT name
      FROM ${table}
      ORDER BY id
    `)
    .all()
    .map(row => row.name);

  };


  return {

    classes:
      getNames("classes"),

    sections:
      getNames("sections"),

    subjects:
      getNames("subjects"),

    feeTypes:
      getNames("fee_types")

  };

}


function deleteMasterData(type, value) {

  const db = getDatabase();

  const table = getMasterTable(type);

  if(!table){

    return {
      success: false,
      message: "Invalid master data type."
    };

  }


  const deleteTransaction =
    db.transaction(() => {


      /*
       Class delete hone par uski
       class-subject configuration bhi remove.
      */

      if(type === "classes"){

        db.prepare(`
          DELETE FROM class_subjects
          WHERE class_name = ?
        `).run(value);

      }


      /*
       Subject delete hone par
       class_subjects se bhi remove.
      */

      if(type === "subjects"){

        db.prepare(`
          DELETE FROM class_subjects
          WHERE subject_name = ?
        `).run(value);

      }


      const result =
        db.prepare(`
          DELETE FROM ${table}
          WHERE name = ?
        `).run(value);


      return {
        success: true,
        changes: result.changes
      };

    });


  return deleteTransaction();

}

/* =========================================
   CLASS-WISE SUBJECTS
========================================= */

function saveClassSubjects(className, subjects) {

  const db = getDatabase();

  className =
    String(className || "").trim();

  subjects =
    Array.isArray(subjects)
    ? subjects
    : [];


  if(!className){

    return {
      success: false,
      message: "Class is required."
    };

  }


  /*
   Transaction use kar rahe hain so that
   old subjects delete hone aur new subjects
   save hone ke beech database incomplete
   state me na rahe.
  */

  const saveTransaction =
    db.transaction(() => {


      /*
       Purani configuration remove
      */

      db.prepare(`

        DELETE FROM class_subjects
        WHERE class_name = ?

      `).run(className);


      /*
       New subjects insert
      */

      const insert =
        db.prepare(`

          INSERT INTO class_subjects
          (
            class_name,
            subject_name
          )

          VALUES (?, ?)

        `);


      for(const subject of subjects){

        const subjectName =
          String(subject || "").trim();


        if(!subjectName){
          continue;
        }


        insert.run(
          className,
          subjectName
        );

      }


      return {
        success: true
      };

    });


  return saveTransaction();

}


/* =========================================
   LOAD CLASS-WISE SUBJECTS
========================================= */

function getClassSubjects() {

  const db = getDatabase();


  const rows =
    db.prepare(`

      SELECT

        class_name AS className,

        subject_name AS subjectName

      FROM class_subjects

      ORDER BY
        class_name,
        id

    `).all();


  /*
   JS frontend ke existing format me
   convert karenge:

   {
     "Class I": ["Hindi","English"],
     "Class II": ["Hindi","Maths"]
   }
  */

  const result = {};


  for(const row of rows){

    if(
      !result[row.className]
    ){

      result[row.className] = [];

    }


    result[row.className].push(
      row.subjectName
    );

  }


  return result;

}

/* =========================================
   APP SETTINGS
========================================= */

function saveSetting(key, value) {

  const db = getDatabase();

  db.prepare(`
    INSERT INTO app_settings
    (
      setting_key,
      setting_value
    )
    VALUES (?, ?)

    ON CONFLICT(setting_key)
    DO UPDATE SET
      setting_value = excluded.setting_value
  `).run(
    key,
    JSON.stringify(value)
  );

  return {
    success: true
  };

}


function loadSetting(key) {

  const db = getDatabase();

  const row = db.prepare(`
    SELECT setting_value
    FROM app_settings
    WHERE setting_key = ?
  `).get(key);

  if (!row) {
    return null;
  }

  try {

    return JSON.parse(
      row.setting_value
    );

  } catch {

    return row.setting_value;

  }

}

/* =========================================
   RESULT SETUP SETTINGS
========================================= */

function getResultSetups() {

  const db = getDatabase();

  const rows = db.prepare(`

    SELECT
      setting_key,
      setting_value

    FROM app_settings

    WHERE setting_key LIKE 'resultSetup:%'

    ORDER BY setting_key

  `).all();


  const result = {};


  for(const row of rows){

    /*
     Example:
     resultSetup:Class 1
          ↓
     Class 1
    */

    const className =
      row.setting_key.substring(
        "resultSetup:".length
      );


    if(!className){
      continue;
    }


    try{

      result[className] =
        JSON.parse(
          row.setting_value
        );

    }catch(error){

      console.error(
        "Invalid Result Setup JSON:",
        row.setting_key,
        error
      );

    }

  }


  return result;

}


/* =========================================
   FEE STRUCTURE
========================================= */

function saveFeeStructure(fee) {

  const db = getDatabase();

  db.prepare(`
    INSERT INTO fee_structures
    (
      id,
      class_name,
      fee_type,
      amount,
      frequency
    )
    VALUES (?, ?, ?, ?, ?)

    ON CONFLICT(id)
    DO UPDATE SET

      class_name = excluded.class_name,
      fee_type = excluded.fee_type,
      amount = excluded.amount,
      frequency = excluded.frequency

  `).run(

    fee.id,
    fee.className,
    fee.type,
    Number(fee.amount) || 0,
    fee.frequency

  );

  return {
    success: true
  };

}


function getFeeStructures() {

  const db = getDatabase();

  return db.prepare(`

    SELECT

      id,

      class_name AS className,

      fee_type AS type,

      amount,

      frequency

    FROM fee_structures

    ORDER BY
      class_name,
      fee_type

  `).all();

}


function deleteFeeStructure(id) {

  const db = getDatabase();

  const result = db.prepare(`

    DELETE FROM fee_structures
    WHERE id = ?

  `).run(id);

  return {
    success: true,
    changes: result.changes
  };

}


/* =========================================
   FEE PAYMENTS
========================================= */

function savePayment(payment) {

  const db = getDatabase();

  db.prepare(`

    INSERT INTO fee_payments
    (
      id,
      receipt_number,
      student_id,
      fee_type,
      amount,
      month,
      payment_mode,
      note,
      payment_date,
      payment_time
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

  `).run(

    payment.id,
    payment.receipt,
    payment.studentId,
    payment.feeType,
    Number(payment.amount) || 0,
    payment.month || "",
    payment.mode || "",
    payment.note || "",
    payment.dateISO || "",
    payment.time || ""

  );

  return {
    success: true
  };

}


function getPayments() {

  const db = getDatabase();

  return db.prepare(`

    SELECT

      id,

      receipt_number AS receipt,

      student_id AS studentId,

      fee_type AS feeType,

      amount,

      month,

      payment_mode AS mode,

      note,

      payment_date AS dateISO,

      payment_time AS time

    FROM fee_payments

    ORDER BY
      payment_date DESC,
      payment_time DESC

  `).all();

}

/* =========================================
   ATTENDANCE WORKING DAYS
========================================= */

function saveAttendanceWorkingDays(data) {

  const db = getDatabase();

  db.prepare(`

    INSERT INTO attendance_working_days
    (
      id,
      session,
      month,
      class_name,
      working_days
    )

    VALUES (?, ?, ?, ?, ?)

    ON CONFLICT(session, month, class_name)
    DO UPDATE SET

      working_days = excluded.working_days

  `).run(

    data.id,
    data.session,
    data.month,
    data.className,
    Number(data.workingDays) || 0

  );

  return {
    success: true
  };

}


function getAttendanceWorkingDays() {

  const db = getDatabase();

  return db.prepare(`

    SELECT

      id,

      session,

      month,

      class_name AS className,

      working_days AS workingDays

    FROM attendance_working_days

    ORDER BY
      session,
      month,
      class_name

  `).all();

}


function deleteAttendanceWorkingDays(id) {

  const db = getDatabase();

  const result = db.prepare(`

    DELETE FROM attendance_working_days
    WHERE id = ?

  `).run(id);

  return {
    success: true,
    changes: result.changes
  };

}


/* =========================================
   STUDENT ATTENDANCE
========================================= */

function saveStudentAttendance(attendance) {

  const db = getDatabase();

  db.prepare(`

    INSERT INTO student_attendance
    (
      id,
      student_id,
      session,
      month,
      class_name,
      section,
      working_days,
      present_days,
      absent_days,
      percentage
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(student_id, session, month)
    DO UPDATE SET

      class_name = excluded.class_name,
      section = excluded.section,
      working_days = excluded.working_days,
      present_days = excluded.present_days,
      absent_days = excluded.absent_days,
      percentage = excluded.percentage

  `).run(

    attendance.id,
    attendance.studentId,
    attendance.session,
    attendance.month,
    attendance.className || "",
    attendance.section || "",
    Number(attendance.workingDays) || 0,
    Number(attendance.presentDays) || 0,
    Number(attendance.absentDays) || 0,
    Number(attendance.percentage) || 0

  );

  return {
    success: true
  };

}


function getStudentAttendance() {

  const db = getDatabase();

  return db.prepare(`

    SELECT

      id,

      student_id AS studentId,

      session,

      month,

      class_name AS className,

      section,

      working_days AS workingDays,

      present_days AS presentDays,

      absent_days AS absentDays,

      percentage

    FROM student_attendance

    ORDER BY
      session,
      month,
      class_name,
      section

  `).all();

}

/* =========================================
   STUDENT RESULTS
========================================= */

function saveStudentResult(result) {

  const db = getDatabase();

  const saveTransaction = db.transaction(() => {

    const studentId = result.studentId;

    const session = result.session;

    /*
     Existing result check
    */

    const existing = db.prepare(`

      SELECT id
      FROM student_results
      WHERE student_id = ?
      AND session = ?

    `).get(
      studentId,
      session
    );


    let resultId;

    if(existing){

      resultId = existing.id;

    }else{

      resultId =
        "RES-" +
        Date.now() +
        "-" +
        studentId;

    }


    /* =====================================
       SAVE MAIN RESULT
    ===================================== */

    db.prepare(`

      INSERT INTO student_results
      (
        id,
        student_id,
        session,
        working_days,
        attendance_days,
        remarks,
        promoted_to,
        next_session_date,
        activities_json,
        updated_at
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON CONFLICT(student_id, session)
      DO UPDATE SET

        working_days = excluded.working_days,
        attendance_days = excluded.attendance_days,
        remarks = excluded.remarks,
        promoted_to = excluded.promoted_to,
        next_session_date = excluded.next_session_date,
        activities_json = excluded.activities_json,
        updated_at = excluded.updated_at

    `).run(

      resultId,

      studentId,

      session,

      Number(result.workingDays) || 0,

      Number(result.attendanceDays) || 0,

      result.remarks || "",

      result.promotedTo || "",

      result.nextSessionDate || "",

      JSON.stringify(
        result.activities || {}
      ),

      new Date().toISOString()

    );


    /*
     Remove old subject marks.

     Isse edit/save ke baad removed subjects
     database me purane nahi rahenge.
    */

    db.prepare(`

      DELETE FROM student_result_marks
      WHERE result_id = ?

    `).run(resultId);


    /* =====================================
       SAVE SUBJECT MARKS
    ===================================== */

    const insertMarks = db.prepare(`

      INSERT INTO student_result_marks
      (
        result_id,
        subject_name,

        quarterly_enabled,
        quarterly_max,
        quarterly_obtained,

        half_yearly_enabled,
        half_yearly_max,
        half_yearly_obtained,

        annual_enabled,
        annual_max,
        annual_obtained
      )

      VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?
      )

    `);


    for(const subject of result.subjects || []){

      insertMarks.run(

        resultId,

        subject.subject || "",


        subject.quarterly?.enabled
          ? 1
          : 0,

        Number(
          subject.quarterly?.max
        ) || 0,

        Number(
          subject.quarterly?.obtained
        ) || 0,


        subject.halfYearly?.enabled
          ? 1
          : 0,

        Number(
          subject.halfYearly?.max
        ) || 0,

        Number(
          subject.halfYearly?.obtained
        ) || 0,


        subject.annual?.enabled
          ? 1
          : 0,

        Number(
          subject.annual?.max
        ) || 0,

        Number(
          subject.annual?.obtained
        ) || 0

      );

    }


    return {
      success: true,
      id: resultId
    };

  });


  return saveTransaction();

}


/* =========================================
   LOAD STUDENT RESULTS
========================================= */

function getStudentResults() {

  const db = getDatabase();


  const results = db.prepare(`

    SELECT *

    FROM student_results

    ORDER BY
      student_id,
      session

  `).all();


  const getMarks = db.prepare(`

    SELECT *

    FROM student_result_marks

    WHERE result_id = ?

    ORDER BY id

  `);


  return results.map(row => {

    const marks =
      getMarks.all(row.id);


    let activities = {};

    try{

      activities =
        JSON.parse(
          row.activities_json || "{}"
        );

    }catch{

      activities = {};

    }


    return {

      studentId:
        row.student_id,

      session:
        row.session,

      workingDays:
        Number(row.working_days || 0),

      attendanceDays:
        Number(row.attendance_days || 0),

      remarks:
        row.remarks || "",

      promotedTo:
        row.promoted_to || "",

      nextSessionDate:
        row.next_session_date || "",

      activities,


      subjects:
        marks.map(m => ({

          subject:
            m.subject_name,

          quarterly: {

            enabled:
              Boolean(
                m.quarterly_enabled
              ),

            max:
              Number(
                m.quarterly_max || 0
              ),

            obtained:
              Number(
                m.quarterly_obtained || 0
              )

          },


          halfYearly: {

            enabled:
              Boolean(
                m.half_yearly_enabled
              ),

            max:
              Number(
                m.half_yearly_max || 0
              ),

            obtained:
              Number(
                m.half_yearly_obtained || 0
              )

          },


          annual: {

            enabled:
              Boolean(
                m.annual_enabled
              ),

            max:
              Number(
                m.annual_max || 0
              ),

            obtained:
              Number(
                m.annual_obtained || 0
              )

          }

        }))

    };

  });

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

  initializeDatabase,
  getDatabase,


  /* =========================================
     STUDENTS
  ========================================= */

  saveStudent,
  getStudents,
  getStudentById,
  deleteStudent,

  /* MASTER DATA */

  addMasterData,
  getMasterData,
  deleteMasterData,

  /* CLASS-WISE SUBJECTS */

  saveClassSubjects,
  getClassSubjects,

  /* =========================================
     APP SETTINGS
  ========================================= */

  saveSetting,
  loadSetting,
  getResultSetups,


  /* =========================================
     FEE STRUCTURE
  ========================================= */

  saveFeeStructure,
  getFeeStructures,
  deleteFeeStructure,


  /* =========================================
     FEE PAYMENTS
  ========================================= */

  savePayment,
  getPayments,


  /* =========================================
     ATTENDANCE WORKING DAYS
  ========================================= */

  saveAttendanceWorkingDays,
  getAttendanceWorkingDays,
  deleteAttendanceWorkingDays,


  /* =========================================
     STUDENT ATTENDANCE
  ========================================= */

  saveStudentAttendance,
  getStudentAttendance,

  /* STUDENT RESULTS */

  saveStudentResult,
  getStudentResults

  

};