import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class HeaderServiceService {
  private _background: string = '#0f212f';
  private _backgroundNavMain: string = '#436280';
  private _backgroundUserNavButton: string = '#436280';
  private _backgroundFooter: string = '#436280';
  private _backgroundHeaderDialog: string = '#436280';
  private _backgroundDeleteLr: string = '';
  private _backgroundDeleteYes: string = '';
  private _backgroundDeleteClose: string = '';
  constructor(private title: Title, private meta: Meta) {}

  setTitle(value: string) {
    this.title.setTitle(value);
    return this;
  }

  setDescription(value: string) {
    this.meta.updateTag({ name: 'description', content: value });
    return this;
  }

  setBackground(value: string) {
    this._background = value;
    return this;
  }

  get background() {
    return this._background;
  }

  setBackgroundNavMain(value: string) {
    this._backgroundNavMain = value;
    return this;
  }

  get backgroundNavMain() {
    return this._backgroundNavMain;
  }

  setBackgroundUserNavButton(value: string) {
    this._backgroundUserNavButton = value;
    return this;
  }

  get backgroundUserNavButton() {
    return this._backgroundUserNavButton;
  }

  setBackgroundFooter(value: string) {
    this._backgroundFooter = value;
    return this;
  }

  get backgroundFooter() {
    return this._backgroundFooter;
  }

  setBackgroundHeaderDialog(value: string) {
    this._backgroundHeaderDialog = value;
    return this;
  }

  get backgroundHeaderDialog() {
    return this._backgroundHeaderDialog;
  }

  setBackgroundDeleteLr(value: string) {
    this._backgroundDeleteLr = value;
    return this;
  }

  get backgroundDeleteLr() {
    return this._backgroundDeleteLr;
  }

  setBackgroundDeleteYes(value: string) {
    this._backgroundDeleteYes = value;
    return this;
  }

  get backgroundDeleteYes() {
    return this._backgroundDeleteYes;
  }

  setBackgroundDeleteClose(value: string) {
    this._backgroundDeleteClose = value;
    return this;
  }

  get backgroundDeleteClose() {
    return this._backgroundDeleteClose;
  }
}
