import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OptionObj, Options } from './options';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LineChartComponent } from './components/line-chart/line-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    LineChartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private http = inject(HttpClient);

  myControl = new FormControl<OptionObj | string>('');
  yearControl = new FormControl<string>('');
  year = '';
  area = '';
  displayedAreas: any[] = [];
  areas: any[] = [];
  showSelection = true;
  showError= false;
  isLoading = false;
  filteredOptions!: Observable<OptionObj[]>;
  filteredYears: string[] = [];

  options = Options;
  yearOptions: string[] = [];
  constructor() {
    for (let year = 2014; year <= 2030; year++) {
      this.yearOptions.push(String(year));
    }
    this.filteredYears = this.yearOptions.slice();
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }
  filter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.filteredYears = this.yearOptions.filter((o) =>
        o.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredYears = this.yearOptions.slice();
    }
  }
  displayFn(option: OptionObj): string {
    return option && option.name ? option.name : '';
  }

  private _filter(name: string): OptionObj[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  getAreaData() {
    const areaFile = (this.myControl.value as OptionObj).value;
    this.area = (this.myControl.value as OptionObj).name;
    if (this.yearControl.value) {
      this.year = this.yearControl.value;
    }

    this.http.get<any>(`../assets/data/${areaFile}.json`).subscribe({
      next: (res) => {
        // console.log(res);
        this.isLoading = true;
          this.showError = false;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        
        this.areas = [...res.Sheet1];
        // console.log(data)
        this.displayedAreas = res.Sheet1.filter((area: any) => {
          // console.log(area);
          return area.history?.toString().includes(this.year.trim());
        });
        if (!this.displayedAreas.length) {
          this.showError = true;
        }
        // console.log(this.displayedAreas);
        this.showSelection = false;
        // this.myControl.setValue('');
        // this.yearControl.setValue('');
      },
      error: () => {
        alert('error in getting data, please try again');
      },
    });
  }
}
