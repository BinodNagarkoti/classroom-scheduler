import React, { useState } from 'react';
import {
    CardContent,
    Chip,
    Avatar,
    Typography,
    Button,
    CardActions,
    Card,
    CardActionArea,
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import SubjectIcon from '@material-ui/icons/Subject';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { useDispatch } from 'react-redux';
import firebase from '../firestore';
import { setFormData, clearFormData } from '../redux/classes';
import { dateTOAMORPM } from '../utils/commonUtils';
const today = new Date();
export const ClassCard = ({
    docid,
    fromDate,
    toDate,
    days,
    index,
    roomno,
    teachername,
    classname,
    subjectname,
    onEditClick,
    root,
}) => {
    const db = firebase.firestore();
    const dispatch = useDispatch();
    return (
        <>
            <Card className={root}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {classname}
                        </Typography>
                        <Typography
                            variant="body2"
                            className="card-subtitle mb-2 text-muted"
                            color="textSecondary"
                            component="h6">
                            {dateTOAMORPM(new Date(Number(fromDate)))} to{' '}
                            {dateTOAMORPM(new Date(Number(toDate)))}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="div">
                            {days.split(',').map((day, index) => (
                                <Chip
                                    label={day}
                                    key={'_day_chip_' + index + 1 * today.getMilliseconds()}
                                    style={{ margin: '2px' }}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary" component="div">
                            <Chip
                                className = 'mr-1'
                                icon={<FaceIcon fontSize={'small'}/>}
                                label={teachername}
                                color="primary"
                            />
                             <Chip
                                className = 'mr-1'
                                icon={<MeetingRoomIcon fontSize={'small'} />}
                                label={roomno}
                            />
                               <Chip
                               icon={<SubjectIcon fontSize={'small'}/>}
                                label={subjectname}
                            />
                        </Typography>
          
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                        onClick={() => {
                            onEditClick();
                            dispatch(
                                setFormData({
                                    teachername,
                                    classname,
                                    days: days.split(','),
                                    fromDate,
                                    toDate,
                                    docid,
                                    subjectname,
                                    roomno,
                                })
                            );
                        }}>
                        Edit
                    </Button>
                    <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                            db.collection('classes')
                                .doc(docid)
                                .delete()
                                .then(() => {
                                    dispatch(clearFormData);
                                    console.log('Deleted');
                                });
                        }}>
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </>
    );
};
