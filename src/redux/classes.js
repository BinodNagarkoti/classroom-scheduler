import { createSlice } from '@reduxjs/toolkit';
const today = new Date();
const oneHourAhead = new Date().setHours(today.getHours() + 1);
const classesSlice = createSlice({
    name: 'classes',
    initialState: {
        formData: {
            docid: null,
            teachername: '',
            classname: '',
            days: [],
            fromDate: today.getTime(),
            toDate: oneHourAhead,
            subjectname: '',
            roomno: '',
        },
        data: undefined,
        error: undefined,
    },
    reducers: {
        setError: (state, action) => {
            return {
                ...state,
                error: action.payload,
            };
        },
        setFormData(state, action) {
            state.formData = {
                docid: action.payload.docid,
                teachername: action.payload.teachername,
                classname: action.payload.classname,
                days: action.payload.days,
                fromDate: action.payload.fromDate,
                toDate: action.payload.toDate,
                subjectname: action.payload.subjectname,
                roomno: action.payload.roomno,
            };
        },
        clearFormData(state) {
            return {
                ...state,
                formData: {
                    docid: null,
                    teachername: '',
                    classname: '',
                    days: [],
                    fromDate: today.getTime(),
                    toDate: oneHourAhead,
                    subjectname: '',
                    roomno: '',
                },
            };
        },
        setDocid: (state, action) => {
            state.formData.docid = action.payload;
        },
        setRoomno: (state, action) => {
            state.formData.roomno = action.payload;
        },
        setTeacherName: (state, action) => {
            state.formData.teachername = action.payload;
        },

        setSubjectName: (state, action) => {
            state.formData.subjectname = action.payload;
        },

        setClassName: (state, action) => {
            state.formData.classname = action.payload;
        },

        setDays: (state, action) => {
            state.formData.days = action.payload;
        },

        setFromDate: (state, action) => {
            state.formData.fromDate = action.payload;
        },

        setToDate: (state, action) => {
            state.formData.toDate = action.payload;
        },

        update: (state, action) => {
            state.formData = action.payload;
        },

        setData: (state, action) => {
            const serializedata = action.payload.map(
                ({ subjectname, roomno, teachername, id, classname, days, from, to }) => {
                    return {
                        docid: id,
                        subjectname,
                        roomno,
                        teachername,
                        classname,
                        fromDate: Number(from),
                        toDate: Number(to),
                        days,
                    };
                }
            );

            return {
                formData: { ...state.formData },
                data: [...serializedata],
            };
        },
        getData() {},
    },
});
export const {
    setTeacherName,
    setSubjectName,
    setRoomno,
    setClassName,
    setDocid,
    setDays,
    clearFormData,
    setError,
    setFromDate,
    getData,
    setToDate,
    update,
    setFormData,
    setData,
} = classesSlice.actions;
export default classesSlice.reducer;
