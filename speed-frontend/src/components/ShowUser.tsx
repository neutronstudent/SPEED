'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, DefaultEmptyUser } from '../app/Users';
import Link from 'next/link';

function ShowUsers() {
  const [user, setUser] = useState<User>(DefaultEmptyUser);

  //const uid = useParams<{ uid: string }>().uid;
  const uid = "66ecf117a2701723b8a23361";
  const navigate = useRouter();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/users/${uid}`)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        setUser(json);
      })
      .catch((err) => {
        console.log('Error from ShowUserDetails: ' + err);
      });
  }, [uid]);

  const UserItem = (
    <div>
      <table className='table table-hover table-dark table-striped table-bordered'>
        <tbody>
          <tr>
            <th scope='row'>1</th>
            <td>UID</td>
            <td>{user.uid}</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>Role</td>
            <td>{user.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className='ShowUserDetails'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-10 m-auto'>
            <br /> <br />
            <Link href='/' className='btn btn-outline-warning float-left'>
              Show User List
            </Link>
          </div>
          <br />
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>User&quot;s Record</h1>
            <p className='lead text-center'>View User&quot;s Info</p>
            <hr /> <br />
          </div>
          <div className='col-md-10 m-auto'>{UserItem}</div>
        </div>
      </div>
    </div>
  );
}

export default ShowUsers;
