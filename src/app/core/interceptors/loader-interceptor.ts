import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpInterceptorFn, HttpContextToken } from "@angular/common/http";
import { LoaderService } from "../services/loader.service";
import { inject } from "@angular/core";
import { finalize } from "rxjs";
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false)

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.context.get(SKIP_LOADER)) {
        return next(req)
    }
    const loader = inject(LoaderService)
    loader.start()
    return next(req).pipe(
        finalize(() => loader.stop())
    )
}