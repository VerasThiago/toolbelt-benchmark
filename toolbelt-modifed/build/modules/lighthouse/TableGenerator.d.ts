import { LighthouseReportDoc, ShortReportObject } from '../../lib/clients/IOClients/apps/Lighthouse';
export interface TableRow {
    [title: string]: any;
}
export declare class TableGenerator {
    private cols;
    private addedCols;
    private rows;
    /**
     * Insert the scores of a report to the table as a row
     *
     * @param report ShortReportObject array representing the scores of this report
     */
    addReportScores(report: ShortReportObject[]): void;
    /**
     * Adds a custom column name to all the rows in this table.
     * Already insert rows will have default value passed as a parameter,
     * but new rows will have its own value
     *
     * @param title Column name
     * @param value Column value for those rows without this information
     */
    addColumn(title: string, value: string): void;
    /**
     * It adds all reports as rows in the current table
     *
     * @param reports List of LighthouseReportDoc of masterdata docs
     */
    addListOfReports(reports: LighthouseReportDoc[]): void;
    /**
     * Prints a well formated table in stdout
     */
    show(): void;
}
