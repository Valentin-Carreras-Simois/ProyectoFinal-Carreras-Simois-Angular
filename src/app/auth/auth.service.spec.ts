import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { TestBed } from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { AuthService } from "./auth.service"
import { User } from "../dashboard/pages/users/models"
import { MockProvider } from 'ng-mocks'
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"

xdescribe('AuthService', () =>{
    let service: AuthService;
    let httpController: HttpTestingController;

    beforeEach(() =>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule, RouterTestingModule],
            providers: [
                MockProvider(Router),
                MockProvider(Store),
            ]
        })

        service = TestBed.inject(AuthService);
        httpController = TestBed.inject(HttpTestingController);
    })

    afterEach(() =>{
        httpController.verify();
    })

    it('Si el login es valido, el observable authUser$ debe emitir un valor', (done) =>{

        const mockUser: User = {
            id: 1,
            email: 'fakemail@fake.com',
            password: '123456',
            name: 'Fake',
            surname: 'User',
            token: 'asdfgklñ11'
        }

        const mockResponse: User[] = [mockUser]

        service.login({
            email: mockUser.email,
            password: mockUser.password,
        });

        httpController.expectOne({
            method: 'GET',
            url: `http://localhost:3000/users?email=${mockUser.email}&password=${mockUser.password}`
        }).flush(mockResponse)

        service.authUsers$.subscribe({
            next: (authUser) => {
                expect (authUser).toBeTruthy(),
                expect(authUser).toEqual(mockUser),
                done();
            }
        })
    })
})