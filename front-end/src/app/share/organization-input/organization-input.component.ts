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
    MatFormFieldModule
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

  @Input() showAddButton = false;
  @Input() multiple: boolean = false;
  @Input() labelTemplate?: TemplateRef<any>;
  @Input() label = 'Institution';
  @Input() placeholder = 'Search ...';
  @Input() hint = 'Must select one of listed institutions';
  @Input() readonly: boolean = false;
  @Input() tooltip?: string;
  @Input() tooltipPosition: TooltipPosition = 'left';
  compareObjects: (v1: any, v2: any) => boolean = (
    v1: any,
    v2: any
  ): boolean => {
    if (v1?.toc_id === v2?.toc_id) return true;
    else return false;
  };
  value?: string | null;
  labelFieldName = 'name';
  onChange?: (value: any) => void;
  onTouched?: () => void;
  filteredOptions$: Observable<any> = of([]);
  partnerInput$ = new Subject<string>();
  searchControl = new FormControl();
  loading = false;
  selectedPartner?: any;
  control = new FormControl('', Validators.required);

  constructor(
    private organizationsService: OrganizationsService,
    public dialogService: MatDialog
  ) {}

  trackByFn(item: any) {
    return item.id;
  }

  ngOnInit(): void {
    this.placeholder = this.placeholder
      ? this.placeholder
      : this.labelFieldName;
    this.filteredOptions$ = concat(
      of([]), // default items
      this.partnerInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        filter((term) => {
          return typeof term == 'string' && term.length >= 2;
        }),
        switchMap((term) => {
          console.log(term);
          return this.organizationsService.searchOrganization(term).pipe(
            catchError(() => of([])), // empty list on error
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
    this.control.setValue(this.selectedPartner);
  }

  displayFn(option: any): string {
    return option && option.name ? option.name : '';
  }

  async writeValue(obj: any) {
    if (obj?.clarisa_id) {
      this.filteredOptions$ = of([obj]);
    } else if (typeof obj == 'number') {
      const org = await this.organizationsService.getOrganization(obj);
      this.filteredOptions$ = of([org]);
    }
    this.value = obj;
    this.selectedPartner = obj;
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
