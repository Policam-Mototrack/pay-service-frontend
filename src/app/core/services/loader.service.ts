import { computed, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
    private _counter = signal(0)
    readonly isLoading = computed(() => this._counter() > 0);

    start(): void {
        this._counter.set(this._counter() + 1)
    }

    stop(): void {
        this._counter.set(this._counter() - 1)
    }

}