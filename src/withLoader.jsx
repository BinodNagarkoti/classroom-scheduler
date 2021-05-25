import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

export default function WithLoader(props) {
        let toRender;
        if (props.isLoading) {
            toRender = <>
                <div style={{margin: '0 auto'}}>
                <Skeleton variant="rect" width={210} height={118} />
                <Skeleton width={150}  />
                <Skeleton width={100} />

                </div>
                <br/>
            </>;
        } else if (props.isEmpty) {
            toRender = <>
                <div style={{margin: '0 auto'}}>
                    No Data to Display
                </div>
                <br/>
            </>;
        } else {
            toRender = props.children;
        }

        return <>
            {toRender}
        </>

}