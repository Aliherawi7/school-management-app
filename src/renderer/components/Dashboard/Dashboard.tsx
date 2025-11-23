import React from 'react';

import { useStateValue } from '../../context/StateProvider';

const Dashboard: React.FC = () => {
    const [{ authentication },] = useStateValue();



    // if (!authentication?.roles?.includes(Roles.SUPER_ADMIN)) {
    //     return <NotFound />
    // }

    return (
        <div className='fade_in'>

        </div>
    )
}

export default Dashboard