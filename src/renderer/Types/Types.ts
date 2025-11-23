import { Timestamp } from 'firebase/firestore';



export interface UpdateModeProps {
    updateMode: boolean; // Change this to the correct type if necessary
}

export interface Schedule {
    className: ClassName;
    subject: Subject;
    teacher: Teacher;
    time: Time;
    day: string;
}

export interface Time {
    startTime: string;
    endTime: string;
}

export interface Teacher {
    id: string;
    createdDate: Date | Timestamp;
    lastName: string;
    name: string
    phoneNumber: string;
    profileImage: string;
    subjects: Subject[],
    resClassName: ClassName,
}

export interface Subject {
    name: string;
    className: ClassName;
    coefficient: number
}

export interface ClassName {
    name: string;
    number: number;
    totalHours: number;
    createdDate: Date;
}

export interface Consumption {
    id: string,
    createdDate: Timestamp | Date,
    amount: number,
    type: string,
    date: Timestamp | Date,
    descriptions: string,
    registrar: string,
}


export interface ConsumptionType {
    name: string;
    createdDate: Timestamp | Date,
    type: string,
}




export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string; // Optional, because not all buttons may need an icon
    btnType?: string; // This could be more specific if you know the types of button styles
    text?: string; // Optional if buttons don’t always require text
    loading?: boolean; // Optional: default value can be 'false'
    isLock?: boolean; // Optional: default value can be 'false'
    isConfirmed?: boolean; // Optional: default value can be 'false'
}

export interface AuthenticationType {
    isAuthenticated: boolean;
    name: string | null;
    lastName: string | null;
    email: string | null;
    userId: string | null;
    imageURL: string | null;
    roles: string[];
}
export interface AskingModal {
    show: boolean,
    message: string,
    btnAction: Function | null,
    id: string | null
}


export interface ConfirmModal {
    show: boolean,
    message: string,
    iconType: string
}


export type ImageUrls = {
    [email: string]: string; // Keys are email strings, values are URL strings
};




export interface DoughnutChartData {
    labels: string[],
    datasets: DoughnutDataSet[]
};

export interface DoughnutDataSet {
    label: string,
    data: number[],
    backgroundColor: string[],
}


export interface Log {
    id: string,
    title: string,
    createdDate: Date | Timestamp,
    registrar: string,
    message: string,
    data: any
}


