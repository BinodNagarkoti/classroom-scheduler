import { useEffect, useState } from 'react';
import firebase from './firestore';
import Chip from '@material-ui/core/Chip';
import 'date-fns';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Card, Grid } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import WithLoader from './withLoader';
import FormControl from '@material-ui/core/FormControl';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';

import './App.css'
const useStyles = makeStyles((theme) => createStyles({
    formRoot: {
        margin: '0 auto',
        width: '50ch',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
}));

function App() {
    const dateTOAMORPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const db = firebase.firestore();
    const styles = useStyles();
    const [classes, setClasses] = useState([]);
    const [docid, setDocid] = useState(null);

    const [teachername, setTeachername] = useState("");
    const [classname, setClassname] = useState("");

    const [fromDate, setFromDate] = useState(new Date());
    const aheadTime = new Date().setHours(fromDate.getHours() + 1)
    const [toDate, setToDate] = useState(new Date(aheadTime));
    const [error, setError] = useState("");
    const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const [days, setDays] = useState([]);


    useEffect(() => {
        const fetchData = async () => {

            db.collection('classes').onSnapshot(snapshot => {
                setClasses(snapshot.docs.map(doc => {
                    console.log(doc.data());
                    return ({ id: doc.id, ...(doc.data()) })
                })
                );
            });
            console.log(classes);
        }
        fetchData();
    }, [])

    const clearAll = () => {
        setTeachername("");
        setClassname("");
        setFromDate(new Date());
        setToDate(new Date().setHours(fromDate.getHours() + 1));
        setDocid(null);
        setDays([]);
        setError("");
    }

    const validateValue = () => {
        if (teachername.length === 0) {
            setError('teacher name is required');
            return false
        }
        if (classname.length === 0) {
            setError('class name is required');
            return false
        }
        if (days.length === 0) {
            setError("select at least one day");
            return false
        }
        return true;
    }
    return (<>

        {/* <!-- As a heading --> */}
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">Class Schedule</span>
            </div>
        </nav>
        <div className="container">
            <form className={styles.formRoot} noValidate autoComplete="off">
                <div class="alert alert-danger" role="alert">
                    {error}
                </div>
                <Typography variant="body2" className="card-subtitle mb-2 text-muted" color="textSecondary" component="p">
                    {docid !== null ? "You can edit desired values and click update" : ''}
                </Typography>
                <FormControl fullWidth className={classes.margin}>
                    <TextField required size='small' id="outlined-basic-1" value={classname} label="class name" onChange={(event) => setClassname(event.target.value)} placeholder="class 1,class 2.." variant="outlined" />
                </FormControl>
                <FormControl fullWidth className={classes.margin}>
                    <TextField required size='small' id="outlined-basic-2" value={teachername} label="teacher name" onChange={(event) => setTeachername(event.target.value)} placeholder="jhon, libiya.." variant="outlined" />
                </FormControl>
                <FormControl fullWidth className={classes.margin}>
                    <Autocomplete
                        required
                        multiple
                        id="fixed-tags-demo"
                        value={days}
                        size='small'
                        onChange={(event, newValue) => {
                            setDays([
                                ...newValue.map(item => item)
                            ]);
                        }}
                        options={weekDays}
                        getOptionLabel={(option) => option}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip key={index}
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Days" variant="outlined" placeholder="sunday, monday..." />
                        )}
                    />
                </FormControl>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        required
                        margin="normal"
                        id="time-picker"
                        size='small'
                        fullWidth
                        label="From"
                        variant="outlined"
                        value={fromDate}
                        onChange={(date) => setFromDate(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                    {/* {fromDate} */}
                    {/* {toDate} */}
                    <KeyboardTimePicker
                        required
                        margin="normal"
                        id="time-picker"
                        variant="outlined"
                        size='small'
                        label="To" fullWidth
                        value={toDate}
                        onChange={(date) => setToDate(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <FormControl fullWidth className={classes.margin}>
                    <Button size='small' variant='outlined' label='Add' color='primary' onClick={() => {
                        if (validateValue()) {
                            if (docid) {
                                db.collection('classes').doc(docid).set({
                                    from: new Date(fromDate.toString()).getTime(),
                                    to: new Date(toDate.toString()).getTime(),
                                    teachername,
                                    classname,
                                    days: days.toString(),
                                })
                                    .then(() => console.log('Successfully updated'))
                                    .catch(error => console.log(error.message));
                            } else {
                                db.collection('classes').doc().set({
                                    from: new Date(fromDate.toString()).getTime(),
                                    to: new Date(toDate.toString()).getTime(),
                                    teachername,
                                    classname,
                                    days: days.toString(),
                                })
                                    .then(() => console.log('Successfully added'))
                                    .catch(error => console.log(error.message));
                            }
                            clearAll();
                        }
                    }} >{docid !== null ? "Update" : "Add"}</Button>
                </FormControl>

            </form>

            <WithLoader isLoading={classes === undefined} isEmpty={classes !== undefined && classes.length === 0}>
                <Grid container direction="row" spacing={1} justify="flex-start" >
                    {classes.map((item, index) =>
                        <Grid item md={3} key={"card_" + index}>
                            <Card className={styles.root}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {item.classname}
                                        </Typography>
                                        <Typography variant="body2" className="card-subtitle mb-2 text-muted" color="textSecondary" component="h6">
                                            {dateTOAMORPM(new Date(Number(item.from)))} to {dateTOAMORPM(new Date(Number(item.to)))}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="div">
                                            {item.days.split(',').map(day => <Chip label={day} style={{ margin: "2px" }} color="primary" variant="outlined" />)}
                                        </Typography>
                                        <br />
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            <Chip
                                                avatar={<Avatar>{item.teachername[0]}</Avatar>}
                                                label={item.teachername}
                                                color="primary"
                                            />
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => {
                                        setTeachername(item.teachername);
                                        setClassname(item.classname);
                                        setDays(item.days.split(','));
                                        setFromDate(new Date(item.from));
                                        setToDate(new Date(item.to));
                                        setDocid(item.id);
                                    }}>
                                        Edit
                            </Button>
                                    <Button size="small" color="primary" onClick={() => {
                                        db.collection("classes").doc(item.id).delete().then(() => console.log("Deleted"))
                                    }}>
                                        Delete
                            </Button>
                                </CardActions>
                            </Card>
                        </Grid>)}
                </Grid >
            </WithLoader>
        </div>
    </>
    );
}

export default App;
