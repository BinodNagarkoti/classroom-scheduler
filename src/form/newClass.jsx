import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'date-fns';
import {
    Chip,
    TextField,
    makeStyles,
    createStyles,
    FormControl,
    Typography,
    Button,
    Grid,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import {
    setTeacherName,
    setSubjectName,
    setRoomno,
    setClassName,
    // setDocid,
    setDays,
    setError,
    clearFormData,
    setFromDate,
    // getData,
    setToDate,
    // update,
    // setData,
} from '../redux/classes';

import firebase from '../firestore';
const useStyles = makeStyles((theme) =>
    createStyles({
        formRoot: {
            margin: '0 auto',
            width: '50ch',
            '& > *': {
                padding: theme.spacing(1),
            },
        },
        root: {
            maxWidth: 345,
        },
        media: {
            height: 140,
        },
    })
);

export const NewClass = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    let {
        error,
        data,
        formData: { classname, teachername, fromDate, toDate, docid, subjectname, roomno, days },
    } = useSelector((state) => state.classes);
    const db = firebase.firestore();

    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const today = new Date();

    const validateValue = () => {
        if (teachername.length === 0) {
            dispatch(setError('teacher name is required'));
            return false;
        }
        if (classname.length === 0) {
            dispatch(setError('class name is required'));
            return false;
        }
        if (days.length === 0) {
            dispatch(setError('select at least one day'));
            return false;
        }
        return true;
    };

    return (
        <>
            <Grid container className={styles.formRoot} id="newClass" justify="flex-start">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <Grid item md={6}>
                    <FormControl fullWidth>
                        <TextField
                            required
                            size="small"
                            id="outlined-basic-1"
                            value={classname}
                            label="class name"
                            onChange={(event) => dispatch(setClassName(event.target.value))}
                            placeholder="class 1,class 2.."
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>
                <Grid item md={6}>
                    <FormControl fullWidth>
                        <TextField
                            required
                            size="small"
                            id="outlined-basic-2"
                            value={teachername}
                            label="teacher name"
                            onChange={(event) => dispatch(setTeacherName(event.target.value))}
                            placeholder="jhon, libiya.."
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>
                <Grid item md={6}>
                    <FormControl fullWidth>
                        <TextField
                            required
                            size="small"
                            id="outlined-basic-2"
                            value={subjectname}
                            label="Subject name"
                            onChange={(event) => dispatch(setSubjectName(event.target.value))}
                            placeholder="Math, Science, break..."
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>

                <Grid item md={6}>
                    <FormControl fullWidth>
                        <TextField
                            required
                            size="small"
                            id="outlined-basic-2"
                            value={roomno}
                            label="Room no"
                            onChange={(event) => dispatch(setRoomno(event.target.value))}
                            placeholder="107, 108, 109..."
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>

                <Grid item md={12}>
                    <FormControl fullWidth>
                        <Autocomplete
                            required
                            multiple
                            id="fixed-tags-demo"
                            value={days ?? []}
                            size="small"
                            onChange={(event, newValue) => {
                                dispatch(setDays(newValue));
                            }}
                            options={weekDays}
                            getOptionLabel={(option) => option}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        key={index + 1 * today.getMilliseconds() + '_chip'}
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Days"
                                    variant="outlined"
                                    placeholder="sunday, monday..."
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item md={6}>
                    <MuiPickersUtilsProvider fullWidth utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            required
                            margin="normal"
                            id="time-picker"
                            size="small"
                            fullWidth
                            label="From"
                            variant="outlined"
                            value={new Date(fromDate)}
                            onChange={(date) => dispatch(setFromDate(date.getTime()))}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            fullWidth
                            required
                            margin="normal"
                            id="time-picker"
                            variant="outlined"
                            size="small"
                            label="To"
                            value={new Date(toDate)}
                            onChange={(date) => dispatch(setToDate(date.getTime()))}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>

                <FormControl fullWidth>
                    <Button
                        size="small"
                        variant="outlined"
                        label="Add"
                        className="close"
                        data-dismiss="modal"
                        color="primary"
                        onClick={() => {
                            if (validateValue()) {
                                if (docid) {
                                    db.collection('classes')
                                        .doc(docid)
                                        .set({
                                            from: fromDate,
                                            to: toDate,
                                            teachername,
                                            classname,
                                            days: days.toString(),
                                            subjectname,
                                            roomno,
                                        })
                                        .then(() => {
                                            dispatch(clearFormData());
                                            console.log('Successfully Updated');
                                        })
                                        .catch((error) => console.log(error.message));
                                } else {
                                    db.collection('classes')
                                        .doc()
                                        .set({
                                            from: fromDate,
                                            to: toDate,
                                            teachername,
                                            classname,
                                            days: days.toString(),
                                            subjectname,
                                            roomno,
                                        })
                                        .then(() => {
                                            dispatch(clearFormData());
                                            console.log('Successfully added');
                                        })
                                        .catch((error) => console.log(error.message));
                                }
                            }
                        }}>
                        {docid !== null ? 'Update' : 'Add'}
                    </Button>
                </FormControl>
            </Grid>
        </>
    );
};
