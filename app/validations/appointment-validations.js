const appointmentValidationSchema={
    patientId:{
        exists:{errorMessage:'patientId is required'},
        notEmpty:{errorMessage:'patientId should not be empty'}
    },
    date:{
        exists:{errorMessage:' appointment date is required'},
        notEmpty:{errorMessage:'appointment date should not be empty'}
    },
    time:{
        exists:{errorMessage:'time is required'},
        notEmpty:{errorMessage:'time should not be empty'}
    },
    status:{
        exists:{errorMessage:'status is required'},
        notEmpty:{errorMessage:'status should not be empty'},
        isIn:{
            options:[['pending','confirmed' , 'cancelled']],
            errorMessage:'satus should be one of pending ,confirmed , cancelled'
        }
    }

}
module.exports=appointmentValidationSchema
