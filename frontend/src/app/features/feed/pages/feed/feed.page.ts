import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'feed-page',
    templateUrl: './feed.page.html',
    styleUrls: ['./feed.page.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedPage {

}