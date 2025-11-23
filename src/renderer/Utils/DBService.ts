import { ClassName, Consumption, ConsumptionType, Log, Schedule, Subject, Teacher, Time } from '../Types/Types';

// import { generateEncyptedUniqueId } from "./Encryption";

// const { ipcRenderer } = window.require('electron');
const { electron } = window;



//  ==================== system condfig ========================

export const getSystemConfig = async (): Promise<SystemConfig> => {
    const data = await electron.ipcRenderer.invoke('get-system-config');
    return data[0]
}

export const addSystemConfig = async (systemConfig: SystemConfig): Promise<SystemConfig> => {
    return await electron.ipcRenderer.invoke('add-system-config', systemConfig);
}

export const updateSystemConfig = async (systemConfig: SystemConfig): Promise<SystemConfig> => {
    return await electron.ipcRenderer.invoke('update-system-config', systemConfig);
}


export const getSystemInfo = async (): Promise<SystemInfo> => {
    return await electron.ipcRenderer.invoke('get-system-info');
}

export const getSystemInfo2 = async (): Promise<SystemInfo2> => {
    return await electron.ipcRenderer.invoke('get-system-info-2');
}




//  =================== backup ===========================

export const exportDatabaseBackup = async () => {
    return await electron.ipcRenderer.invoke('db-export');
}

export const importDatabaseBackup = async (data) => {
    return await electron.ipcRenderer.invoke('db-import', data);
}



//  ======================  Teacher ==================================

export const getTeachers = async (): Promise<Teacher[]> => {
    return await electron.ipcRenderer.invoke('get-teachers');
};

export const addTeacher = async (teacher: Teacher): Promise<Teacher> => {
    return await electron.ipcRenderer.invoke('add-teacher', teacher);
};

export const updateTeacher = async (teacher: Teacher): Promise<Teacher> => {
    return await electron.ipcRenderer.invoke('update-teacher', teacher);
};

export const deleteTeacher = async (teacher: Teacher): Promise<void> => {
    return await electron.ipcRenderer.invoke('delete-teacher', teacher);
};
export const getTeacherById = async (id: number): Promise<Teacher> => {
    return await electron.ipcRenderer.invoke('get-teacher-by-id', id);
};
export const findTeacherByNameAndLastName = async (query: string): Promise<Teacher[]> => {
    return await electron.ipcRenderer.invoke('get-teacher-by-name', query);
}



//  ======================  Doctor ==================================

export const getClassNames = async (): Promise<ClassName[]> => {
    return await electron.ipcRenderer.invoke('get-classNames');
};

export const addClassName = async (className: ClassName): Promise<ClassName> => {
    return await electron.ipcRenderer.invoke('add-className', className);
};

export const updateClassName = async (className: ClassName): Promise<ClassName> => {
    return await electron.ipcRenderer.invoke('update-className', className);
};

export const deleteClassName = async (className: ClassName): Promise<void> => {
    return await electron.ipcRenderer.invoke('delete-className', className);
};
export const getClassNameById = async (id: number): Promise<ClassName[]> => {

    return await electron.ipcRenderer.invoke('get-className-by-id', id);
};



// ======================== Subjects ===================================

export const addSubject = async (subject: Subject): Promise<Subject> => {
    return await electron.ipcRenderer.invoke('add-subject', subject);
}
export const updateSubject = async (subject: Subject): Promise<Subject> => {
    return await electron.ipcRenderer.invoke('update-subject', subject);
}


export const getSubjects = async (): Promise<Subject[]> => {
    return await electron.ipcRenderer.invoke('get-subjects');
}

export const deleteSubject = async (subject: Subject): Promise<void> => {
    return await electron.ipcRenderer.invoke('delete-subject', subject);
}


export const getSubjectsByclassId = async (classId: number): Promise<Subject[]> => {
    return await electron.ipcRenderer.invoke('get-subjects-by-classId', classId);
}

export const getSubjectsByTeacherId = async (classId: number): Promise<Subject[]> => {
    return await electron.ipcRenderer.invoke('get-subjects-by-teacherId', classId);
}



//  ======================  Doctor ==================================

export const getTimes = async (): Promise<Time[]> => {
    return await electron.ipcRenderer.invoke('get-times');
};

export const addTime = async (time: Time): Promise<Time> => {
    return await electron.ipcRenderer.invoke('add-time', time);
};

export const updateTime = async (time: Time): Promise<Time> => {
    return await electron.ipcRenderer.invoke('update-time', time);
};

export const deleteTime = async (time: Time): Promise<void> => {
    return await electron.ipcRenderer.invoke('delete-time', time);
};
export const getTimeById = async (id: number): Promise<Time> => {
    return await electron.ipcRenderer.invoke('get-time-by-id', id);
};




//  ======================  Schedules ==================================

export const getSchedules = async (): Promise<Schedule[]> => {
    return await electron.ipcRenderer.invoke('get-schedules');
};

export const addSchedule = async (schedule: Schedule): Promise<Schedule> => {
    return await electron.ipcRenderer.invoke('add-schedule', schedule);
};

export const updateSchedule = async (schedule: Schedule): Promise<Schedule> => {
    return await electron.ipcRenderer.invoke('update-schedule', schedule);
};

export const deleteSchedule = async (schedule: Schedule): Promise<void> => {
    return await electron.ipcRenderer.invoke('delete-schedule', schedule);
};
export const getScheduleById = async (id: number): Promise<Schedule> => {
    return await electron.ipcRenderer.invoke('get-schedule-by-id', id);
};


// ======================== Logs ===================================

export const addLog = async (log: Log): Promise<Log> => {
    return await electron.ipcRenderer.invoke('add-log', log);
}

export const updateLog = async (log: Log): Promise<Log> => {
    return await electron.ipcRenderer.invoke('update-log', log);
}
export const getLogs = async (): Promise<Log[]> => {
    return await electron.ipcRenderer.invoke('get-logs');
}


export const getTodayLogs = async (): Promise<Log[]> => {
    // const logs: Log[] = await electron.ipcRenderer.invoke('get-today-logs');
    const logs: Log[] = await getLogs();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    return logs.filter(rec => {
        console.log(rec);
        console.log(rec.createdDate >= startOfDay && rec.createdDate <= endOfDay);
        return rec.createdDate >= startOfDay && rec.createdDate <= endOfDay
    });
}


// ======================== Consumptions ===================================

export const addConsumption = async (consumption: Consumption): Promise<Consumption[]> => {
    return await electron.ipcRenderer.invoke('add-consumption', consumption);
}

export const getConsumptions = async (): Promise<Consumption[]> => {
    return await electron.ipcRenderer.invoke('get-consumptions');
}

export const deleteConsumption = async (consumption: Consumption): Promise<Consumption[]> => {
    return await electron.ipcRenderer.invoke('delete-consumption', consumption);
}

export const getTodayConsumptions = async (): Promise<Consumption[]> => {
    const consumptions: Consumption[] = await electron.ipcRenderer.invoke('get-today-consumptions');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    return consumptions.filter(rec => {
        console.log(rec);
        console.log(rec.date >= startOfDay && rec.date <= endOfDay);
        return rec.date >= startOfDay && rec.date <= endOfDay
    });
}

export const getConsumptionsByType = async (type: string): Promise<Consumption[]> => {
    return await electron.ipcRenderer.invoke('get-consumptions-by-type', type);
}

// ======================== Consumptions types ===================================

export const addConsumptionType = async (consumption: ConsumptionType): Promise<ConsumptionType> => {
    return await electron.ipcRenderer.invoke('add-consumption-type', consumption);
}

export const getConsumptionTypes = async (): Promise<ConsumptionType[]> => {
    return await electron.ipcRenderer.invoke('get-consumption-types');
}

export const deleteConsumptionType = async (consumption: ConsumptionType): Promise<ConsumptionType> => {
    return await electron.ipcRenderer.invoke('delete-consumption-type', consumption);
}

export const updateConsumptionType = async (consumptionType: ConsumptionType): Promise<ConsumptionType> => {
    return await electron.ipcRenderer.invoke('update-consumption-type', consumptionType);
}




