import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import {
  FirestoreProvider,
  useFirebaseApp,
  DatabaseProvider,
  AuthProvider,
} from "reactfire";
import { AppContent } from "./AppContent.tsx";

function App() {
  const app = useFirebaseApp();
  const database = getDatabase(app);
  const auth = getAuth(app);
  const firestoreInstance = getFirestore(useFirebaseApp());

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <FirestoreProvider sdk={firestoreInstance}>
          <AppContent />
        </FirestoreProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
