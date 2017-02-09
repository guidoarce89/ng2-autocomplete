import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
    selector: 'autocomplete',
    template: require('./templates/autocomplete.template.html'),
    styles: [require('./templates/autocomplete.template.css')]
})

export class AutocompleteComponent implements OnInit, OnChanges {
    @Input('permiteNuevo') allowNew: boolean;
    @Input('dato') foundData: string;
    @Input('datos') searchData: any;
    @Input('mostrarCampo') propToShow: string;
    @Input('retornaCampo') propToReturn: string;

    @Output('buscar') search = new EventEmitter();
    @Output('agregar') add = new EventEmitter();
    @Output('seleccionar') select = new EventEmitter();

    public loadingData: boolean = false;
    public searchTerm: string;
    public searching: boolean;

    private omittedKeys = ['Meta', 'Tab', 'Alt', 'Control', 'Shift', 'ArrowLeft', 'ArrowRight'];
    private timeout: any;

    ngOnInit() {
        this.initSearch();
    }

    ngOnChanges() {
        this.loadingData = false;
    }

    initSearch() {
        this.searchTerm = "";
        this.foundData = this.searchTerm;
        this.searching = false;
    }

    prepareData(event: any, term: string) {
        // Proceed only if not an omitted key
        if (this.omittedKeys.indexOf(event.key) == -1) {
            switch (event.key) {
                case 'Escape':
                    if (this.loadingData) {
                        this.clearTimeout();
                    } else {
                        this.initSearch();
                    }
                    break;

                case 'ArrowUp':
                    break;

                case 'ArrowDown':
                    if (this.searching && !this.loadingData) {
                        // Tiene que ir al primer item de la lista si esta focus en el input
                    }
                    break;

                default:
                    this.searching = true;
                    this.loadingData = true;
                    this.searchTerm = term;
                    this.restartTimeout();
                    break;
            }
        }
    }

    replaceToSearchTerm() {
        this.foundData = this.searchTerm;
    }

    /**
     * Start the current timeout and notify to Host the searched term
     * @param ms Number of milliseconds of the timeout
     */
    startTimeout(ms: number = 500) {
        this.timeout = setTimeout(() => {
            this.search.emit(this.searchTerm);
        }, ms);
    }

    /**
     * Restart the current timeout
     */
    restartTimeout() {
        this.clearTimeout();
        this.startTimeout();
    }

    /**
     * Crear/Off the current timeout
     */
    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    /**
     * Notify to Host that user want to add new data
     * and pass user's searched term
     */
    addData() {
        this.searching = false;
        this.add.emit(this.searchTerm);
    }

    /**
     * Notify to Host user's selection
     * @param selectedData
     */
    selectData(selectedData) {
        this.searching = false;
        this.foundData = selectedData[this.propToShow];

        if (this.propToReturn) {
            this.select.emit(selectedData[this.propToReturn]);
        } else {
            this.select.emit(selectedData);
        }
    }
}