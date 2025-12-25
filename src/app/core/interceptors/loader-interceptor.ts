import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpInterceptorFn } from "@angular/common/http";
import { LoaderService } from "../services/loader.service";
import { inject } from "@angular/core";
import { finalize } from "rxjs";

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loader = inject(LoaderService)
    loader.start()
    return next(req).pipe(
        finalize(() => loader.stop())
    )
}