const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const path = require("path");
const { readLicense, activateLicense, deactivateLicense } = require("./license");
const {
  initializeDatabase,

  /* STUDENTS */

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

  /* SETTINGS */

  saveSetting,
  loadSetting,
  getResultSetups,

  /* FEE STRUCTURE */

  saveFeeStructure,
  getFeeStructures,
  deleteFeeStructure,

  /* FEE PAYMENTS */

  savePayment,
  getPayments,

  /* ATTENDANCE WORKING DAYS */

  saveAttendanceWorkingDays,
  getAttendanceWorkingDays,
  deleteAttendanceWorkingDays,

  /* STUDENT ATTENDANCE */

  saveStudentAttendance,
  getStudentAttendance,

  /* STUDENT RESULTS */

  saveStudentResult,
  getStudentResults

} = require("./database");

/* =========================================
   STUDENT IPC
========================================= */

ipcMain.handle(
  "student:save",
  async (event, student) => {

    try {

      return saveStudent(student);

    } catch (error) {

      console.error(
        "Student Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "student:getAll",
  async () => {

    try {

      return getStudents();

    } catch (error) {

      console.error(
        "Student Load Error:",
        error
      );

      return [];

    }

  }
);


ipcMain.handle(
  "student:getById",
  async (event, id) => {

    try {

      return getStudentById(id);

    } catch (error) {

      console.error(error);

      return null;

    }

  }
);


ipcMain.handle(
  "student:delete",
  async (event, id) => {

    try {

      return deleteStudent(id);

    } catch (error) {

      console.error(
        "Student Delete Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);

/* =========================================
   MASTER DATA IPC
========================================= */

ipcMain.handle(
  "master:add",
  async (event, type, value) => {

    try {

      return addMasterData(
        type,
        value
      );

    } catch (error) {

      console.error(
        "Master Data Add Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "master:getAll",
  async () => {

    try {

      return getMasterData();

    } catch (error) {

      console.error(
        "Master Data Load Error:",
        error
      );

      return null;

    }

  }
);


ipcMain.handle(
  "master:delete",
  async (event, type, value) => {

    try {

      return deleteMasterData(
        type,
        value
      );

    } catch (error) {

      console.error(
        "Master Data Delete Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);

/* =========================================
   CLASS-WISE SUBJECTS IPC
========================================= */

ipcMain.handle(
  "classSubjects:save",
  async (event, className, subjects) => {

    try {

      return saveClassSubjects(
        className,
        subjects
      );

    } catch (error) {

      console.error(
        "Class Subjects Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "classSubjects:getAll",
  async () => {

    try {

      return getClassSubjects();

    } catch (error) {

      console.error(
        "Class Subjects Load Error:",
        error
      );

      return {};

    }

  }
);

/* =========================================
   APP SETTINGS IPC
========================================= */

ipcMain.handle(
  "settings:save",
  async (event, key, value) => {

    try {

      return saveSetting(
        key,
        value
      );

    } catch (error) {

      console.error(
        "Setting Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "settings:load",
  async (event, key) => {

    try {

      return loadSetting(key);

    } catch (error) {

      console.error(
        "Setting Load Error:",
        error
      );

      return null;

    }

  }
);

/* =========================================
   RESULT SETUP IPC
========================================= */

ipcMain.handle(
  "resultSetup:getAll",
  async () => {

    try {

      return getResultSetups();

    } catch (error) {

      console.error(
        "Result Setup Load Error:",
        error
      );

      return {};

    }

  }
);

/* =========================================
   FEE STRUCTURE IPC
========================================= */

ipcMain.handle(
  "feeStructure:save",
  async (event, fee) => {

    try {

      return saveFeeStructure(fee);

    } catch (error) {

      console.error(
        "Fee Structure Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "feeStructure:getAll",
  async () => {

    try {

      return getFeeStructures();

    } catch (error) {

      console.error(
        "Fee Structure Load Error:",
        error
      );

      return [];

    }

  }
);


ipcMain.handle(
  "feeStructure:delete",
  async (event, id) => {

    try {

      return deleteFeeStructure(id);

    } catch (error) {

      console.error(
        "Fee Structure Delete Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);

/* =========================================
   FEE PAYMENT IPC
========================================= */

ipcMain.handle(
  "payment:save",
  async (event, payment) => {

    try {

      return savePayment(payment);

    } catch (error) {

      console.error(
        "Payment Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "payment:getAll",
  async () => {

    try {

      return getPayments();

    } catch (error) {

      console.error(
        "Payment Load Error:",
        error
      );

      return [];

    }

  }
);

/* =========================================
   ATTENDANCE WORKING DAYS IPC
========================================= */

ipcMain.handle(
  "attendanceWorkingDays:save",
  async (event, data) => {

    try {

      return saveAttendanceWorkingDays(data);

    } catch (error) {

      console.error(
        "Attendance Working Days Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "attendanceWorkingDays:getAll",
  async () => {

    try {

      return getAttendanceWorkingDays();

    } catch (error) {

      console.error(
        "Attendance Working Days Load Error:",
        error
      );

      return [];

    }

  }
);


ipcMain.handle(
  "attendanceWorkingDays:delete",
  async (event, id) => {

    try {

      return deleteAttendanceWorkingDays(id);

    } catch (error) {

      console.error(
        "Attendance Working Days Delete Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


/* =========================================
   STUDENT ATTENDANCE IPC
========================================= */

ipcMain.handle(
  "attendance:save",
  async (event, attendance) => {

    try {

      return saveStudentAttendance(
        attendance
      );

    } catch (error) {

      console.error(
        "Student Attendance Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "attendance:getAll",
  async () => {

    try {

      return getStudentAttendance();

    } catch (error) {

      console.error(
        "Student Attendance Load Error:",
        error
      );

      return [];

    }

  }
);

/* =========================================
   STUDENT RESULTS IPC
========================================= */

ipcMain.handle(
  "result:save",
  async (event, result) => {

    try {

      return saveStudentResult(result);

    } catch (error) {

      console.error(
        "Student Result Save Error:",
        error
      );

      return {
        success: false,
        message: error.message
      };

    }

  }
);


ipcMain.handle(
  "result:getAll",
  async () => {

    try {

      return getStudentResults();

    } catch (error) {

      console.error(
        "Student Result Load Error:",
        error
      );

      return [];

    }

  }
);

/* =========================================
   PDF PRINT IPC
========================================= */

ipcMain.handle("print:document", async (event, html) => {

  let printWindow = null;

  try {

    printWindow = new BrowserWindow({
      show: false,
      width: 900,
      height: 1200,

      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>

      <meta charset="UTF-8">

      <style>

        @page {
          size: A4 portrait;
          margin: 3mm;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family: Arial, sans-serif;
        }

        table {
          border-collapse: collapse;
        }

        th,
        td {
          padding: 5px;
          text-align: center;
        }

      </style>

    </head>

    <body>
      ${html}
    </body>

    </html>
    `;

    await printWindow.loadURL(
      "data:text/html;charset=utf-8," +
      encodeURIComponent(printHTML)
    );

    /* CREATE A4 PDF */

    const pdfData =
      await printWindow.webContents.printToPDF({

        printBackground: true,

        pageSize: "A4",

        landscape: false,

        margins: {
          top: 0.12,
          bottom: 0.12,
          left: 0.12,
          right: 0.12
        }

      });


    /* TEMP PDF LOCATION */

    const pdfFolder =
      path.join(
        app.getPath("userData"),
        "Print"
      );

    const fs = require("fs");

    if(!fs.existsSync(pdfFolder)){
      fs.mkdirSync(
        pdfFolder,
        { recursive: true }
      );
    }


    const pdfPath =
      path.join(
        pdfFolder,
        "School-Document.pdf"
      );


    fs.writeFileSync(
      pdfPath,
      pdfData
    );


    printWindow.close();
    printWindow = null;


    /* OPEN PDF IN WINDOWS */

    const { shell } =
      require("electron");

    await shell.openPath(pdfPath);


    return {
      success: true,
      path: pdfPath
    };


  } catch(error) {

    console.error(
      "PDF Print Error:",
      error
    );

    if(printWindow){

      try{
        printWindow.close();
      }catch{}

    }

    return {
      success: false,
      message: error.message
    };

  }

});

/* =========================================
   OFFLINE LICENSE IPC
========================================= */

ipcMain.handle("license:getStatus", async () => readLicense());

ipcMain.handle("license:deactivate", async (event) => {
  const result = deactivateLicense();
  if (result && result.success === true) {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      setTimeout(() => {
        if (!win.isDestroyed()) win.loadFile("license.html");
      }, 250);
    }
  }
  return result;
});

ipcMain.handle("license:activate", async (event, code) => {
  const result = activateLicense(code);

  if (result && result.success === true) {
    const win = BrowserWindow.fromWebContents(event.sender);

    if (win && !win.isDestroyed()) {
      setTimeout(() => {
        if (!win.isDestroyed()) {
          win.loadFile("index.html");
        }
      }, 350);
    }
  }

  return result;
});

function createWindow() {

  const win = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.on("preload-error", (event, preloadPath, error) => {
  console.error("PRELOAD ERROR:");
  console.error("Path:", preloadPath);
  console.error(error);
});

  const licenseStatus = readLicense();

  if (licenseStatus.valid) {
    win.loadFile("index.html");
  } else {
    win.loadFile("license.html");
  }
}

app.whenReady().then(() => {

  initializeDatabase();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

});

app.on("window-all-closed", () => {

  if (process.platform !== "darwin") {
    app.quit();
  }

});