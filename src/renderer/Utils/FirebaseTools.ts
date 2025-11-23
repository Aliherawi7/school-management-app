// import { ConsumptionsType, vapidKey } from "../constants/Others";
// import { Employee, EmployeePayment, Consumption, Log, Partner, User, PatientPayment, Patient, Job } from "../Types/Types";
// import { Timestamp, addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore"
// import { db, messaging, storage } from "../constants/FirebaseConfig"
// import { getDownloadURL, ref } from "firebase/storage";
// import { mapDocToConsumptions, mapDocToEmployee, mapDocToLog, mapDocToPartner, mapDocToUploadedFile, mapDocToUser } from "./Mapper";
// import * as Mapper from "./Mapper";

// import Collections from "../constants/Collections"
// import Folders from "../constants/Folders";
// import { UploadedFile } from "../components/FilesManagement/FilesManagement";
// import { getToken } from "firebase/messaging";
// import { t } from "i18next";

// const patientsCollectionsRef = collection(db, Collections.Patients);
// const patientPaymentsCollectionRef = collection(db, Collections.PatientPayments);
// const usersCollectionRef = collection(db, Collections.Users);
// const employeePaymentsCollectionRef = collection(db, Collections.EmployeePayments);
// const employeesCollectionRef = collection(db, Collections.Employees);
// const filesCollectionRef = collection(db, Collections.Files);
// const partnersCollectionRef = collection(db, Collections.Partners);
// const consumptionCollectionRef = collection(db, Collections.Consumptions);
// const logCollectionsRef = collection(db, Collections.Logs);
// const jobsCollectionsRef = collection(db, Collections.Jobs);




// export const checkIfEmailIsAlreadyExist = async (email: string): Promise<Boolean> => {
//     const testQuery = query(usersCollectionRef, where("email", "==", email));
//     const querySnapshot = await getDocs(testQuery);
//     // Check if any documents were returned
//     return !querySnapshot.empty;
// };


// export const getAllUploadedFile = async (): Promise<UploadedFile[]> => {
//     const q = query(
//         filesCollectionRef,
//         orderBy("date", 'asc')
//     );
//     try {
//         const docSnap = await getDocs(q);
//         console.log('users: ', docSnap.docs);
//         return docSnap.docs.map(item => mapDocToUploadedFile(item));
//     } catch (err) {
//         throw err
//     }
// };



// export const getUserImage = async (email: string): Promise<string> => {
//     try {
//         const imageRef = ref(storage, Folders.UserImages(email.toLowerCase()));  // Adjust the path to your image

//         // Fetch the download URL
//         const downloadURL = await getDownloadURL(imageRef);

//         return downloadURL;
//     } catch (err) {
//         // const imageRef = ref(storage, Folders.DefaultImages('profile_avatar.png'))
//         // const downloadURL = await getDownloadURL(imageRef);
//         return '';
//     }
// };







// //  ============= users =================
// // Function to get a document by its ID
// export async function getUserByEmail(email: string): Promise<User | undefined> {
//     const q = query(
//         usersCollectionRef,
//         where("email", "==", email.toLowerCase())
//     );
//     try {
//         const docSnap = await getDocs(q);
//         console.log('users: ', docSnap.docs);
//         if (docSnap.docs.length > 0)
//             return mapDocToUser(docSnap.docs[0]);
//         else
//             throw new Error("not found")
//     } catch (err) {
//         throw err
//     }
// }


// export async function getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
//     const q = query(
//         usersCollectionRef,
//         where("phoneNumber", "==", phoneNumber)
//     );
//     try {
//         const docSnap = await getDocs(q);
//         console.log('users: ', docSnap.docs);
//         if (docSnap.docs.length > 0)
//             return mapDocToUser(docSnap.docs[0]);
//         else {
//             throw new Error(t('userAccountNotFound'));
//         }
//     } catch (err) {
//         throw err
//     }
// }

// // Function to get a document by its ID
// export async function getUserByOriginalEntityId(id: string): Promise<User | undefined> {
//     const q = query(
//         usersCollectionRef,
//         where("originalEntityId", "==", id)
//     );
//     try {
//         const docSnap = await getDocs(q);
//         console.log('users: ', docSnap.docs);
//         if (docSnap.docs.length > 0)
//             return mapDocToUser(docSnap.docs[0]);
//         else
//             throw new Error('not found')
//     } catch (err) {
//         throw err
//     }
// }


// // Function to get a document by its ID
// export async function updateUserForSectionsAccess(user: User): Promise<any> {
//     const customerDoc = doc(db, Collections.Users, user.id)
//     return updateDoc(customerDoc, { ...user });
// }


// // Function to get a document by its ID
// export async function disableUserAccountBy(user: User): Promise<any> {
//     const customerDoc = doc(db, Collections.Users, user.id)
//     return updateDoc(customerDoc, { ...user, disabled: true });
// }

// // Function to get a document by its ID
// export async function enableUserAccountBy(user: User): Promise<any> {
//     const customerDoc = doc(db, Collections.Users, user.id)
//     return updateDoc(customerDoc, { ...user, disabled: false });
// }





// //  =========================== partner service =================================

// export const getPartners = async (): Promise<Partner[]> => {
//     const querySnapshot = await getDocs(partnersCollectionRef);
//     const items: Partner[] = querySnapshot.docs.map((doc) => {
//         return mapDocToPartner(doc)
//     });
//     return items
// }

// export const getPartnerById = async (partnerId: string): Promise<Partner> => {
//     const docRef = doc(partnersCollectionRef, partnerId);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         return mapDocToPartner(docSnap);
//     } else {
//         throw new Error('Not found')
//     }

// }



// //  =========================== consumptions service =================================

// export const getConsumptionsByType = async (type: string): Promise<Consumption[]> => {
//     const q = query(
//         consumptionCollectionRef,
//         where("type", "==", type),
//         orderBy("date", "asc")
//     );
//     const querySnapshot = await getDocs(q);
//     const items: Consumption[] = querySnapshot.docs.map((doc) => {
//         return mapDocToConsumptions(doc)
//     });
//     return items
// }

// export const getTodayConsumptions = async (): Promise<Consumption[]> => {
//     const date = new Date();
//     // Get the start and end of today
//     const startOfDay = new Date(date.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(date.setHours(23, 59, 59, 999));
//     const q = query(
//         consumptionCollectionRef,
//         where("date", ">=", Timestamp.fromDate(startOfDay)), // Start of today
//         where("date", "<=", Timestamp.fromDate(endOfDay)),   // End of today
//         orderBy("date", "asc")
//     );

//     const querySnapshot = await getDocs(q);

//     // Map the documents to Consumption items
//     return querySnapshot.docs.map((doc) => mapDocToConsumptions(doc));
// };

// export const getConsumptionsWithdrawOfPartner = async (partnerId: string): Promise<Consumption[]> => {
//     const q = query(
//         consumptionCollectionRef,
//         where("type", "==", ConsumptionsType.WITHDRAW),
//         where("to.id", "==", partnerId),
//         orderBy("date", "asc")
//     );
//     const querySnapshot = await getDocs(q);
//     console.log('cons: w: ', querySnapshot.docs);

//     const items: Consumption[] = querySnapshot.docs.map((doc) => {
//         return mapDocToConsumptions(doc)
//     });
//     return items
// }

// export const getAllConsumptions = async (): Promise<Consumption[]> => {
//     const querySnapshot = await getDocs(collection(db, Collections.Consumptions));
//     return querySnapshot.docs.map(doc => mapDocToConsumptions(doc));
// };




// // ================================= notification service ================================================== //


// export const requestPermissionAndGetToken = async () => {
//     try {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//             const token = await getToken(messaging, {
//                 vapidKey: vapidKey, // Replace with your VAPID key
//             });
//             console.log('FCM Token:', token);
//             return token;
//         } else {
//             console.log('Notification permission denied');
//         }
//     } catch (error) {
//         console.error('Error getting token:', error);
//     }
// };



// export async function sendLog(log: Log) {
//     return await addDoc(logCollectionsRef, log);
// }

// export async function getAllLogs(): Promise<Log[]> {
//     const querySnapshot = await getDocs(logCollectionsRef);
//     // Map the documents to Consumption items
//     return querySnapshot.docs.map((doc) => mapDocToLog(doc));
// }

// export async function getTodayLogs(): Promise<Log[]> {
//     const date = new Date();
//     // Get the start and end of today
//     const startOfDay = new Date(date.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(date.setHours(23, 59, 59, 999));
//     const q = query(
//         logCollectionsRef,
//         where("createdDate", ">=", Timestamp.fromDate(startOfDay)), // Start of today
//         where("createdDate", "<=", Timestamp.fromDate(endOfDay)),   // End of today
//         orderBy("createdDate", "asc")
//     );

//     const querySnapshot = await getDocs(q);

//     // Map the documents to Consumption items
//     return querySnapshot.docs.map((doc) => mapDocToLog(doc));
// }





// //  ========================== employee service ==================================


// // Function to get a document by its ID
// export async function getEmployeeById(docId: string): Promise<Employee> {
//     const docRef = doc(employeesCollectionRef, docId);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         return mapDocToEmployee(docSnap);
//     } else {
//         throw new Error('Not found')
//     }
// }

// export const getEmployees = async () => {
//     const querySnapshot = await getDocs(employeesCollectionRef);
//     return querySnapshot.docs.map((doc) => mapDocToEmployee(doc));
// };

// export const getEmployeesPayments = async (): Promise<EmployeePayment[]> => {
//     const querySnapshot = await getDocs(employeePaymentsCollectionRef);
//     return querySnapshot.docs.map((doc) => Mapper.mapDocToEmployeePayment(doc));
// };

// export const getAllEmployeePayments = async (employeeId: string): Promise<EmployeePayment[]> => {
//     const q = query(
//         employeePaymentsCollectionRef,
//         where("employeeId", "==", employeeId),
//         orderBy("date", "asc")
//     );

//     try {
//         const querySnapshot = await getDocs(q);
//         console.log('querysnapshot is empty: ', querySnapshot.empty);
//         // First map to an array, then filter and sort
//         let items: EmployeePayment[] = querySnapshot.docs
//             .map(doc => mapDocToEmployeePayment(doc))
//         return items;

//     } catch (error) {
//         console.error("Error getting documents: ", error);
//         return []
//     }
// }



// export async function updateEmployee(employeeId: string, employee: Employee) {
//     const customerDoc = doc(db, Collections.Employees, employeeId);
//     return await updateDoc(customerDoc, { ...employee });
// }



// // ============================  jobs  =======================================


// export const getJobs = async (): Promise<Job[]> => {
//     const querySnapshot = await getDocs(jobsCollectionsRef);
//     return querySnapshot.docs.map((doc) => Mapper.mapDocToJob(doc));
// };




// // ============================ patients service ==================================


// export const getCustomerPaymentByCustomerIds = async (patientIds: string[]): Promise<PatientPayment[]> => {
//     if (patientIds.length === 0) return [];
//     const q = query(
//         patientPaymentsCollectionRef,
//         where('patientId', 'in', patientIds),
//     );

//     try {
//         const querySnapshot = await getDocs(q);
//         // First map to an array, then filter and sort
//         let items: PatientPayment[] = querySnapshot.docs
//             .map(doc => Mapper.mapDocToPatientPayment(doc))

//         return items;

//     } catch (error) {
//         console.error("Error getting documents: ", error);
//         return []
//     }
// };


// export const getPatients = async (): Promise<Patient[]> => {

//     try {
//         const querySnapshot = await getDocs(patientsCollectionsRef);
//         console.log('querysnapshot is empty: ', querySnapshot.empty);

//         let items: any[] = querySnapshot.docs
//             .map(doc => Mapper.mapDocToPatient(doc))

//         return items;

//     } catch (error) {
//         console.error("Error getting documents: ", error);
//         return []
//     }
// };


// export const getCustomersByCustomerById = async (id: string): Promise<Patient> => {
//     const docRef = doc(patientsCollectionsRef, id);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         return Mapper.mapDocToPatient(docSnap);
//     } else {
//         throw new Error('Not found')
//     }
// };





// export const getAllCustomerPaymentsOfToday = async (): Promise<PatientPayment[]> => {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0); // Start of today (midnight)

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999); // End of today

//     const q = query(
//         patientPaymentsCollectionRef,
//         where("createdDate", ">=", startOfDay),
//         where("createdDate", "<=", endOfDay)
//     );
//     try {
//         const querySnapshot = await getDocs(q);
//         let items: PatientPayment[] = querySnapshot.docs
//             .map(doc => Mapper.mapDocToPatientPayment(doc));
//         return items;
//     } catch (error) {
//         // console.error("Error getting documents: ", error);
//         return []
//     }
// };





// export const getAllCustomerPayments = async (customerId: string): Promise<PatientPayment[]> => {
//     const q = query(
//         patientPaymentsCollectionRef,
//         where("patientId", "==", customerId),
//         orderBy("date", "asc")
//     );

//     try {
//         const querySnapshot = await getDocs(q);
//         // First map to an array, then filter and sort
//         let items: PatientPayment[] = querySnapshot.docs
//             .map(doc => Mapper.mapDocToPatientPayment(doc))

//         return items;

//     } catch (error) {
//         console.error("Error getting documents: ", error);
//         return []
//     }
// };




