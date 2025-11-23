import { DocumentData } from 'firebase/firestore';

import { Consumption } from '../components/Consumptions/AddConsumptions/AddConsumptions';
import { Employee, EmployeePayment, Job, Log, Patient, PatientPayment, User } from '../Types/Types';

// ==>   in this file we are going to map the DocumentData object to appropriate data object using mapper function  <== //

export const mapDocToPatient = (doc: DocumentData): Patient => {
    const data = doc.data();
    return {
        id: doc.id,
        createdDate: data.createdDate,
        lastName: data.lastName,
        location: data.location,
        name: data.name,
        phoneNumber: data.phoneNumber,
        joinedDate: data.joinedDate,

    }
}


export const mapDocToEmployee = (doc: DocumentData): Employee => {
    const data = doc.data();
    return {
        id: doc.id,
        createdDate: data.createdDate,
        joinedDate: data.joinedDate,
        lastName: data.lastName,
        name: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
        jobTitle: data.jobTitle,
        salaryHistory: data.salaryHistory,
        profileImage: '',
        employmentPeriods: data.employmentPeriods,
        salary: data.salary,
    }
}



export const mapDocToUser = (doc: DocumentData): User => {
    const data = doc.data();
    console.log(data);

    return {
        id: doc.id,
        joinedDate: data.joinedDate,
        lastName: data.lastName,
        name: data.name,
        originalEntityId: data.originalEntityId,
        password: data.password,
        phoneNumber: data.phoneNumber,
        email: data.email,
        roles: data.roles,
        userType: data.userType,
        disabled: data.disabled,
        sectionsAccess: data.sectionsAccess ? data.sectionsAccess : []
    }
}



export const mapDocToEmployeePayment = (doc: DocumentData): EmployeePayment => {
    const data = doc.data();
    return {
        amount: data.amount,
        employeeId: data.employeeId,
        createdDate: data.createdDate,
        date: data.date,
        by: data.by,
        type: data.type,
        id: doc.id
    }
}


export const mapDocToPatientPayment = (doc: DocumentData): PatientPayment => {
    const data = doc.data();
    return {
        id: doc.id,
        amount: data.amount,
        by: data.by,
        checkNumber: data.checkNumber,
        createdDate: data.createdDate,
        date: data.date,
        patientId: data.customerId,
        saleId: data.saleId
    }
}



export const mapDocToConsumptions = (docSnapshot: DocumentData): Consumption => {
    const docData = docSnapshot?.data(); // Extract data
    return {
        id: docSnapshot.id, // Use the document ID
        amount: docData.amount,
        createdDate: docData.createdDate,
        date: docData.date,
        descriptions: docData.descriptions,
        registrar: docData.registrar,
        to: docData.to,
        type: docData.type
    };
};

export const mapDocToLog = (docSnapshot: DocumentData): Log => {
    const docData = docSnapshot?.data(); // Extract data
    return {
        id: docSnapshot.id, // Use the document ID
        createdDate: docData.createdDate,
        message: docData.message,
        registrar: docData.registrar,
        title: docData.title,
        data: docData.data
    };
};

export const mapDocToJob = (docSnapshot: DocumentData): Job => {
    const docData = docSnapshot?.data(); // Extract data
    return {
        code: docSnapshot.code, // Use the document ID
        registrar: docData.registrar,
        conditions: docData.conditions,
        endTime: docData.endTime,
        startTime: docData.startTime,
        title: docData.title,
        salary: docData.salary,
        responsibilities: docData.responsibilities
    };
};

