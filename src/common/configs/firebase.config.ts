import admin from "firebase-admin";
import serviceAccount from "@src/common/key/key.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
