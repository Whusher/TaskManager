import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

function Dashboard(){
    return(
        <div className='text-center'>
            <h1 className='font-semibold text-2xl'>Hello world this is my task manager</h1>
        </div>
    )
}


export default function DashboardPage() {
  return (
    <DashboardLayout child={<Dashboard/>}/>
  )
}
