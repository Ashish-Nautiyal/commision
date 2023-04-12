export class User {
    name:String;
    address:String;
    phoneNumber:String;
    email:String;
    password:String;
    role:String;
    reference:String;
    organisation:String;

    constructor(){
        this.email='';
        this.password='';
        this.name='';
        this.address='';
        this.phoneNumber='';
        this.role='';
        this.reference=''
        this.organisation=''
    }
}
