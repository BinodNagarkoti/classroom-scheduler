import { useEffect, useState } from 'react';
import firebase from './firestore';
import 'date-fns';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import WithLoader from './withLoader';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from './Navbar/navbar';
import { setData } from './redux/classes';
import { BootstrapModal } from './Modal/bootstrapModal';
import './App.css';
import { ClassCard } from './Card/classcard';
import { NewClass } from './form/newClass';
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

function App() {
    const dispatch = useDispatch();
    const db = firebase.firestore();
    const styles = useStyles();
    const today = new Date();
    useEffect(() => {
        const fetchData = async () => {
            db.collection('classes').onSnapshot((snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                dispatch(setData(data));
            });
        };
        fetchData();
    }, []);
    let {
        error,
        data,
        formData: { docid },
    } = useSelector((state) => state.classes);

    const [classModelTitle, setClassModelTitle] = useState('Create New Class Schedule');
    // if (docid) {
    //     setClassModelTitle('Update Class Schedule');
    // }
    return (
        <>
            {/* <!-- As a heading --> */}
            <Navbar />
            {/* <!-- Modal --> */}
            <BootstrapModal title={classModelTitle}>
                <NewClass />
            </BootstrapModal>

            <div className="container">
                <WithLoader
                    isLoading={data === undefined}
                    isEmpty={data !== undefined && data.length === 0}>
                    <Grid
                        container
                        direction="row"
                        id="AllClasses"
                        spacing={1}
                        justify="flex-start">
                        {data &&
                            data.map((item, index) => (
                                <Grid item md={3} key={(index + 1) * today.getMilliseconds()}>
                                    <ClassCard
                                        root={styles.root}
                                        classname={item.classname}
                                        index={index}
                                        teachername={item.teachername}
                                        fromDate={item.fromDate}
                                        toDate={item.toDate}
                                        docid={item.docid}
                                        roomno={item.roomno}
                                        subjectname={item.subjectname}
                                        days={item.days}
                                        onEditClick={() =>
                                            setClassModelTitle('Edit Class Schedule')
                                        }
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </WithLoader>
            </div>
        </>
    );
}

export default App;
