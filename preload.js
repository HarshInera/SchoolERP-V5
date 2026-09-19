const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD.JS LOADED");

contextBridge.exposeInMainWorld("schoolAPI", {

  /* OFFLINE LICENSE */
  getLicenseStatus: () => ipcRenderer.invoke("license:getStatus"),
  activateLicense: (code) => ipcRenderer.invoke("license:activate", code),
  deactivateLicense: () => ipcRenderer.invoke("license:deactivate"),

  /* =========================================
     STUDENTS
  ========================================= */

  saveStudent: (student) =>
    ipcRenderer.invoke(
      "student:save",
      student
    ),

  getStudents: () =>
    ipcRenderer.invoke(
      "student:getAll"
    ),

  getStudentById: (id) =>
    ipcRenderer.invoke(
      "student:getById",
      id
    ),

  deleteStudent: (id) =>
    ipcRenderer.invoke(
      "student:delete",
      id
    ),

      /* =========================================
     MASTER DATA
  ========================================= */

  addMasterData: (type, value) =>
    ipcRenderer.invoke(
      "master:add",
      type,
      value
    ),

  getMasterData: () =>
    ipcRenderer.invoke(
      "master:getAll"
    ),

  deleteMasterData: (type, value) =>
    ipcRenderer.invoke(
      "master:delete",
      type,
      value
    ),

      /* =========================================
     CLASS-WISE SUBJECTS
  ========================================= */

  saveClassSubjects: (className, subjects) =>
    ipcRenderer.invoke(
      "classSubjects:save",
      className,
      subjects
    ),

  getClassSubjects: () =>
    ipcRenderer.invoke(
      "classSubjects:getAll"
    ),


  /* =========================================
     APP SETTINGS
  ========================================= */

  saveSetting: (key, value) =>
    ipcRenderer.invoke(
      "settings:save",
      key,
      value
    ),

  loadSetting: (key) =>
    ipcRenderer.invoke(
      "settings:load",
      key
    ),

   /* RESULT SETUP */

  getResultSetups: () =>
  ipcRenderer.invoke(
    "resultSetup:getAll"
  ),
  
  /* =========================================
     FEE STRUCTURE
  ========================================= */

  saveFeeStructure: (fee) =>
    ipcRenderer.invoke(
      "feeStructure:save",
      fee
    ),

  getFeeStructures: () =>
    ipcRenderer.invoke(
      "feeStructure:getAll"
    ),

  deleteFeeStructure: (id) =>
    ipcRenderer.invoke(
      "feeStructure:delete",
      id
    ),

      /* =========================================
     FEE PAYMENTS
  ========================================= */

  savePayment: (payment) =>
    ipcRenderer.invoke(
      "payment:save",
      payment
    ),

  getPayments: () =>
    ipcRenderer.invoke(
      "payment:getAll"
    ),


    /* =========================================
     ATTENDANCE WORKING DAYS
  ========================================= */

  saveAttendanceWorkingDays: (data) =>
    ipcRenderer.invoke(
      "attendanceWorkingDays:save",
      data
    ),

  getAttendanceWorkingDays: () =>
    ipcRenderer.invoke(
      "attendanceWorkingDays:getAll"
    ),

  deleteAttendanceWorkingDays: (id) =>
    ipcRenderer.invoke(
      "attendanceWorkingDays:delete",
      id
    ),


  /* =========================================
     STUDENT ATTENDANCE
  ========================================= */

  saveStudentAttendance: (attendance) =>
    ipcRenderer.invoke(
      "attendance:save",
      attendance
    ),

  getStudentAttendance: () =>
    ipcRenderer.invoke(
      "attendance:getAll"
    ),

      /* =========================================
     STUDENT RESULTS
  ========================================= */

  saveStudentResult: (result) =>
    ipcRenderer.invoke(
      "result:save",
      result
    ),

  getStudentResults: () =>
    ipcRenderer.invoke(
      "result:getAll"
    ),
  

  /* =========================================
     PRINT
  ========================================= */

  printDocument: (html) =>
    ipcRenderer.invoke(
      "print:document",
      html
    )

});