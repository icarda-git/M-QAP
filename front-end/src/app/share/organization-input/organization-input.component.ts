import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';
import { OrganizationsService } from 'src/app/services/organizations.service';
import { Organization } from '../types/organization.model.type';

@Component({
  selector: 'app-organization-input',
  templateUrl: './organization-input.component.html',
  styleUrls: ['./organization-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrganizationInputComponent),
      multi: true,
    },
  ],
})
export class OrganizationInputComponent
  implements ControlValueAccessor, OnDestroy, OnInit
{
  @Output() add = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Input() multiple: boolean = false;
  @Input() labelTemplate?: TemplateRef<any>;
  @Input() placeholder = 'Search ...';
  @Input() readonly: boolean = false;

  value?: string | null;
  labelFieldName = 'name';
  filteredOptions$: Observable<any> = of([]);
  partnerInput$ = new Subject<string>();
  searchControl = new FormControl();
  loading = false;
  selectedItem?: any;
  control = new FormControl('', Validators.required);

  onChange?: (value: any) => void;
  onTouched?: () => void;
  compareObjects: (v1: any, v2: any) => boolean = (v1, v2): boolean => {
    return v1.id === v2;
  };
  trackByFn(item: Organization) {
    return item.id;
  }

  constructor(
    private organizationsService: OrganizationsService,
    public dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.placeholder = this.placeholder
      ? this.placeholder
      : this.labelFieldName;
    this.filteredOptions$ = concat(
      of([]),
      this.partnerInput$.pipe(
        distinctUntilChanged(),
        filter((term) => {
          return typeof term == 'string' && term.length >= 2;
        }),
        tap(() => (this.loading = true)),
        switchMap((term) => {
          console.log(term);
          return this.organizationsService.searchOrganization(term).pipe(
            catchError(() => of([])),
            tap(() => (this.loading = false))
          );
        })
      )
    );
    this.control.valueChanges.subscribe((value) => {
      this.value = value;
      if (this.onTouched) this.onTouched();
      if (this.onChange) this.onChange(value);
    });
  }

  selected() {
    this.control.setValue(this.selectedItem);
  }

  displayFn(option: Organization): string {
    return option && option.name ? option.name : '';
  }

  async writeValue(obj: any) {
    if (obj?.clarisa_id) {
      this.filteredOptions$ = of([obj]);
    } else if (typeof obj == 'number') {
      this.organizationsService.get(obj).subscribe((org) => {
        this.filteredOptions$ = of([org]);
      });
    }
    this.value = obj;
    this.selectedItem = obj;
    this.control.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
  ngOnDestroy(): void {}
}
