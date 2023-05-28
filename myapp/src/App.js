import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { doc, getFirestore } from "firebase/firestore";
import {
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
  DatabaseProvider,
  AuthProvider,
  useSigninCheck,
} from "reactfire";

function App() {
  const app = useFirebaseApp();

  const database = getDatabase(app);
  const auth = getAuth(app);

  const firestoreInstance = getFirestore(useFirebaseApp());
  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <FirestoreProvider sdk={firestoreInstance}>
          <h1>🌯</h1>
          <BurritoTaste />
        </FirestoreProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}

function BurritoTaste() {
  // easily access the Firestore library
  const burritoRef = doc(useFirestore(), "tryreactfire", "burrito");
  const check = useSigninCheck();

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(burritoRef);

  // easily check the loading status
  if (status === "loading") {
    return <p>Fetching burrito flavor...</p>;
  }

  return <p>The burrito is {data.yummy ? "good" : "bad"}!</p>;
}

export default App;
