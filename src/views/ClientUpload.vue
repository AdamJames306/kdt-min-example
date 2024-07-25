<template>
  <div>
    <h3 v-if="currentDocument">
      Uploading document: {{ currentDocument.name }}
    </h3>
    <h4 v-if="selectedFile">File name: {{ selectedFile.name }}</h4>
    <p>Please review your document before clicking upload.</p>
    <div class="document-preview">
      <img v-if="fileType === 'image'" :src="fileUrl" alt="Document Preview" />
      <video v-if="fileType === 'video'" :src="fileUrl" controls></video>
      <p v-if="!fileType">Unable to preview this file type.</p>
    </div>
    <div class="options">
      <button @click="handleUpload(selectedFile)">Upload</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage, db } from "../../firebaseConfig";

const route = useRoute();
const currentDocument = ref(null);
const selectedFile = ref(null);
const fileUrl = ref(null);
const fileType = ref(null);

const simulatedFile = new File([""], "example.pdf", {
  type: "application/pdf",
});

onMounted(() => {
  const auth = getAuth();
  const email = "testuser@kdt.com";
  const password = "testtest";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Authenticated Test User:", userCredential.user);
      handleAuthenticatedUser(userCredential.user);
    })
    .catch((error) => {
      console.error("Error signing in test user:", error);
    });

  selectedFile.value = simulatedFile;
  fileUrl.value = URL.createObjectURL(simulatedFile);
  fileType.value = simulatedFile.type.startsWith("image")
    ? "image"
    : simulatedFile.type.startsWith("video")
      ? "video"
      : null;
  currentDocument.value = {
    name: "Sample Document",
    description: "A pre-uploaded document",
    uploaded: false,
  };
});

const handleAuthenticatedUser = async () => {
  const token = route.query.token;
  const requestId = route.query.requestId;

  if (token && requestId) {
    try {
      const requestDataFromFirestore = await fetchRequestData(requestId);
      console.log(
        "Request Data fetched from Firestore:",
        requestDataFromFirestore,
      );
    } catch (error) {
      console.error("Error fetching request data:", error);
    }
  } else {
    console.error("Token or Request ID is missing from query parameters.");
  }
};

const fetchRequestData = async (requestId) => {
  try {
    const requestDocRef = doc(db, "requests", requestId);
    const requestDoc = await getDoc(requestDocRef);

    if (requestDoc.exists()) {
      const data = requestDoc.data();
      return { ...data, requestId };
    } else {
      console.error("No request data found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching request data from Firestore:", error);
    return null;
  }
};

const handleUpload = async (file) => {
  try {
    const requestId = route.query.requestId;
    const fileRef = storageRef(
      storage,
      `requests/${requestId}/documents/${file.name}`,
    );
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File uploaded successfully:", downloadURL);
    await updateDocumentStatus(file.name, downloadURL);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const updateDocumentStatus = async (fileName, downloadURL) => {
  try {
    const requestId = route.query.requestId;
    console.log("Request ID:", requestId);

    if (!requestId) {
      throw new Error("Request ID is missing from route parameters.");
    }

    // Simplified for demonstration
    console.log(`Document ${fileName} uploaded with URL: ${downloadURL}`);
  } catch (error) {
    console.error("Error updating document status:", error);
  }
};
</script>

<style scoped>
.document-preview img,
.document-preview video {
  max-width: 100%;
  max-height: 300px;
}

.options {
  margin: 20px 0;
}

.options button {
  margin: 10px;
}
</style>
