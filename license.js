"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const { app } = require("electron");

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqAW6MxltAPZO7RnBCuiv
wnHcNdA6aORnw2kbApYd6CeaRjefFhadj320zdm0cmWbobTzHzS5lW1z8xjNwcLF
QSZzgw3F0nsuMGX5gIpKY02TLFzY89RYP72+Ia+TPbfB1uOKt/mLUWJCLBsDoi57
BocFetjrg8Xi/9nRoMJrJwXZ1jS62obd7M9FgDOJ2s3EvBGu/Hg5V2+Tpp5aE5je
QzQUKfnyw++HQnGu6MqUJ5T3pQfPlS5Ijy+i/VoMmyZl3OBpBSpE8KOvKzGrWTUU
f1HeTDi4Fjgl403mjk97R+zO1oIG8hfpCIdcVpPEafMtkm56md+tVBhi0KmPzfal
YQIDAQAB
-----END PUBLIC KEY-----`;

function getWindowsMachineGuid() {
  if (process.platform !== "win32") return "";
  try {
    const output = execFileSync(
      "reg",
      ["query", "HKLM\\SOFTWARE\\Microsoft\\Cryptography", "/v", "MachineGuid"],
      { encoding: "utf8", windowsHide: true, stdio: ["ignore", "pipe", "ignore"] }
    );
    const match = output.match(/MachineGuid\s+REG_SZ\s+([^\r\n]+)/i);
    return match ? match[1].trim() : "";
  } catch {
    return "";
  }
}

function getMachineCode() {
  const stableId = getWindowsMachineGuid() || `${os.hostname()}|${os.arch()}|${os.platform()}`;
  const hex = crypto
    .createHash("sha256")
    .update(`SCHOOL_ERP|${stableId}`, "utf8")
    .digest("hex")
    .toUpperCase()
    .slice(0, 24);

  return "SERP-" + hex.match(/.{1,4}/g).join("-");
}

function getLicensePath() {
  const dir = path.join(app.getPath("userData"), "License");
  return {
    dir,
    file: path.join(dir, "license.dat")
  };
}

function decodeAndVerify(code) {
  const clean = String(code || "").trim();
  const parts = clean.split(".");
  if (parts.length !== 2) throw new Error("Invalid license code format.");

  const payloadBytes = Buffer.from(parts[0], "base64url");
  const signature = Buffer.from(parts[1], "base64url");

  const verified = crypto.verify(
    "RSA-SHA256",
    payloadBytes,
    PUBLIC_KEY,
    signature
  );

  if (!verified) throw new Error("License signature is invalid.");

  let payload;
  try {
    payload = JSON.parse(payloadBytes.toString("utf8"));
  } catch {
    throw new Error("License data is invalid.");
  }

  if (payload.product !== "SCHOOL_ERP") {
    throw new Error("License is for a different product.");
  }

  const machineCode = getMachineCode();
  if (String(payload.machineCode || "").toUpperCase() !== machineCode) {
    throw new Error("This license is not valid for this computer.");
  }

  if (payload.expiresAt) {
    const expiry = new Date(`${payload.expiresAt}T23:59:59.999`);
    if (Number.isNaN(expiry.getTime())) throw new Error("License expiry date is invalid.");
    if (Date.now() > expiry.getTime()) throw new Error("This license has expired.");
  }

  return payload;
}

function readLicense() {
  const machineCode = getMachineCode();

  try {
    const { file } = getLicensePath();
    if (!fs.existsSync(file)) {
      return {
        valid: false,
        machineCode,
        message: "Software is not activated on this computer."
      };
    }

    const code = fs.readFileSync(file, "utf8").trim();
    const license = decodeAndVerify(code);

    return {
      valid: true,
      machineCode,
      license
    };
  } catch (error) {
    return {
      valid: false,
      machineCode,
      message: error.message || "License validation failed."
    };
  }
}

function deactivateLicense() {
  try {
    const { file } = getLicensePath();
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    return {
      success: true,
      machineCode: getMachineCode()
    };
  } catch (error) {
    return {
      success: false,
      machineCode: getMachineCode(),
      message: error.message || "License deactivation failed."
    };
  }
}

function activateLicense(code) {
  try {
    const license = decodeAndVerify(code);
    const { dir, file } = getLicensePath();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, String(code).trim(), { encoding: "utf8", mode: 0o600 });

    return {
      success: true,
      machineCode: getMachineCode(),
      license
    };
  } catch (error) {
    return {
      success: false,
      machineCode: getMachineCode(),
      message: error.message || "Activation failed."
    };
  }
}

module.exports = {
  getMachineCode,
  readLicense,
  activateLicense,
  deactivateLicense
};
