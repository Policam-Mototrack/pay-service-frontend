import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { FormFieldComponent } from '../../../../shared/components/ui/form-field/form-field.component'
import { StandartButtonComponent } from '../../../../shared/components/ui/standart-button/standart-button.component'
import { SellerAuthService } from '../../services/seller-auth.service'

@Component({
  selector: 'app-seller-login-page',
  standalone: true,
  imports: [PageContainerComponent, FormFieldComponent, StandartButtonComponent, ReactiveFormsModule],
  templateUrl: './seller-login-page.component.html',
  styleUrl: './seller-login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerLoginPageComponent implements OnInit {
  private sellerAuthService = inject(SellerAuthService)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef)
  private title = inject(Title)

  public loginControl = new FormControl('', { nonNullable: true, validators: [Validators.required] })
  public passwordControl = new FormControl('', { nonNullable: true, validators: [Validators.required] })

  public form = new FormGroup({
    login: this.loginControl,
    password: this.passwordControl,
  })

  ngOnInit(): void {
    this.title.setTitle('Вход в кабинет продавца')
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return
    }

    this.sellerAuthService
      .login({
        login: this.loginControl.value.trim(),
        password: this.passwordControl.value,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/seller/products']),
      })
  }
}
